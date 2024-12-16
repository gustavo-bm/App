import mongoose from "mongoose";
import { Request, Response } from "express";
import Account from "../models/accountModel";
import Transfer from "../models/transferModel";
import ITransfer from "../interfaces/ITransfer";

const aggregationPipeline = [
    {
      $lookup: {
        from: 'accounts',  // Nome da coleção de contas
        localField: 'sender',  // Campo sender da transferência
        foreignField: '_id',  // Campo _id da coleção de contas
        as: 'senderDetails',  // Nome do campo para armazenar o resultado
      }
    },
    {
      $lookup: {
        from: 'accounts',  // Nome da coleção de contas
        localField: 'receiver',  // Campo receiver da transferência
        foreignField: '_id',  // Campo _id da coleção de contas
        as: 'receiverDetails',  // Nome do campo para armazenar o resultado
      }
    },
    {
      $unwind: '$senderDetails'  // Desestruturar o array para acessar o documento diretamente
    },
    {
      $unwind: '$receiverDetails'  // Desestruturar o array para acessar o documento diretamente
    },
    {
      $lookup: {
        from: 'users',  // Nome da coleção de usuários
        localField: 'senderDetails.user',  // Campo user na conta de sender
        foreignField: '_id',  // Campo _id da coleção de usuários
        as: 'senderUser'  // Nome do campo para armazenar o usuário remetente
      }
    },
    {
      $lookup: {
        from: 'users',  // Nome da coleção de usuários
        localField: 'receiverDetails.user',  // Campo user na conta de receiver
        foreignField: '_id',  // Campo _id da coleção de usuários
        as: 'receiverUser'  // Nome do campo para armazenar o usuário destinatário
      }
    },
    {
      $unwind: '$senderUser'  // Desestruturar o array para acessar o usuário diretamente
    },
    {
      $unwind: '$receiverUser'  // Desestruturar o array para acessar o usuário diretamente
    },
    {
      $project: {
        _id: 1, // 1 is to show the field, 0 is to hide the field
        amount: 1,
        createdAt: 1,
        updatedAt: 1,
        sender_account: { 
          _id: '$senderDetails._id',
          user: '$senderDetails.user', 
          name: '$senderUser.name', 
          account_type: '$senderDetails.account_type',
          balance: '$senderDetails.balance',
        },
        receiver_account: {
          _id: '$receiverDetails._id',
          user: '$receiverDetails.user', 
          name: '$receiverUser.name',  
          account_type: '$receiverDetails.account_type',
          balance: '$receiverDetails.balance',
        }
      }
    }
];

const getTransfers = async (req: Request, res: Response): Promise<void> => {
    try {
        const transfers = await Transfer.aggregate(aggregationPipeline);
          
        res.status(200).json(transfers);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
            return;
        } else {
            res.status(500).json({ message: "An error occurred" });
            return;
        }
    }
}

const getTransfersFromAccount = async (req : Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const transfers: ITransfer | ITransfer[] | null = await Transfer.findById(id);

        if (!transfers) {
            res.status(404).json({ message: "Transfers not found"});
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
            return;
        } else {
            res.status(500).json({ message: "An unknown error occured" });
            return;
        }
    }
}

const makeTransfer = async (req: Request, res: Response): Promise<void> => {
    const session = await mongoose.startSession();

    try {
        const transactionResults = await session.withTransaction(async () => {
        
            const id_sender = req.params.id_sender;
            const id_receiver = req.params.id_receiver;
            const amount = req.body.amount;

            // check if the sender and receiver are the same
            if (id_sender === id_receiver) {
                throw new Error("Sender and receiver cannot be the same account");
            }

            // check if the sender has enough balance
            const sender = await Account.findById(id_sender);

            if (!sender || sender.balance < amount) {
                if (!sender) {
                    console.log("Sender account not found");
                } else {
                    console.log("Sender account was found, but it has insufficient balance (make money dude!)");
                }
            }

            // within a session, every operation must be completed, otherwise it will all be rolled back
            const senderUpdate = await Account.updateOne(
                { _id: id_sender },
                { $inc: { balance: -amount } },
                { session } 
            );

            const receiverUpdate = await Account.updateOne(
                { _id: id_receiver },
                { $inc: { balance: amount } },
                { session }
            );

            const transfer =  {
                sender: id_sender,
                receiver: id_receiver,
                amount: amount
            }
        
            // its needed to create the document since it doesnt exist yet
            const insertTransferResults = await Transfer.create([transfer], { session });

            if (!senderUpdate.modifiedCount || !receiverUpdate.modifiedCount || insertTransferResults.length === 0) {
                throw new Error("Transaction failed: One or more operations did not succeed.");
            }
            return true;
        });

        if (transactionResults) {
            res.status(200).json({ message: "Transaction completed successfully" });
        } else {
            res.status(500).json({ message: "Transaction failed" });
        }
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json(`message: An error occurred: ${error.message}`);
            return;
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
            return;
        }
    } finally {
        await session.endSession();
    }
}

module.exports = {
    getTransfers,
    getTransfersFromAccount,
    makeTransfer
}