import mongoose from "mongoose";
import { Request, Response } from "express";
import Account from "../models/accountModel";
import Transfer from "../models/transferModel";
import ITransfer from "../interfaces/ITransfer";

const getTransfers = async (req: Request, res: Response): Promise<void> => {
    try {
        const transfers: ITransfer[] | null = await Transfer.find();
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
        
            // post route: /:id_sender-:id_receiver or post route: /:id_sender/:id_receiver
            // const id_sender = req.params.id_sender;
            // const id_receiver = req.params.id_receiver;

            const id_sender = req.body.id_sender;
            const id_receiver = req.body.id_receiver;
            const amount = req.body.amount;

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