import mongoose from "mongoose";
import { Request, Response } from "express";
import Account from "../models/accountModel";
import Transfer from "../models/transferModel";
import ITransfer from "../interfaces/ITransfer";

const aggregationPipeline = [
  {
    $lookup: {
      from: "accounts", 
      localField: "sender",
      foreignField: "_id",
      as: "senderDetails",
    },
  },
  {
    $lookup: {
      from: "accounts", 
      localField: "receiver", 
      foreignField: "_id",
      as: "receiverDetails",
    },
  },
  {
    $unwind: "$senderDetails",
  },
  {
    $unwind: "$receiverDetails", 
  },
  {
    $lookup: {
      from: "users",
      localField: "senderDetails.user", 
      foreignField: "_id", 
      as: "senderUser", 
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "receiverDetails.user", 
      foreignField: "_id", 
      as: "receiverUser", 
    },
  },
  {
    $unwind: "$senderUser", 
  },
  {
    $unwind: "$receiverUser", 
  },
  {
    $project: {
      _id: 1, // 1 is to show the field, 0 is to hide the field
      amount: 1,
      createdAt: 1,
      updatedAt: 1,
      sender_account: {
        _id: "$senderDetails._id",
        user_id: "$senderDetails.user",
        name: "$senderUser.name",
        account_type: "$senderDetails.account_type",
        balance: "$senderDetails.balance",
      },
      receiver_account: {
        _id: "$receiverDetails._id",
        user_id: "$receiverDetails.user",
        name: "$receiverUser.name",
        account_type: "$receiverDetails.account_type",
        balance: "$receiverDetails.balance",
      },
    },
  },
];

const getTransfers = async (req: Request, res: Response): Promise<void> => {
  try {
    const transfers: ITransfer[] = await Transfer.aggregate(aggregationPipeline);

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
};

const getTransfersFromAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const transfers: ITransfer | ITransfer[] | null = await Transfer.findById(
      id
    );

    if (!transfers) {
      res.status(404).json({ message: "Transfers not found" });
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
};

const makeTransfer = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();

  try {
    const transactionResults = await session.withTransaction(async () => {
      const id_sender = req.params.id_sender;
      const id_receiver = req.params.id_receiver;
      const mode = req.body.mode;
      const amount = req.body.amount;

      // check if the sender and receiver are the same
      if (id_sender === id_receiver) {
        throw new Error("Sender and receiver cannot be the same account");
      }

      // check if the sender has enough balance
      const sender = await Account.findById(id_sender);

      if ( !sender || sender.balance < amount && mode === 'balance' ) {
        if (!sender) {
          console.log("Sender account not found");
        } else {
          console.log(
            "Sender account was found, but it has insufficient balance (make money dude!)"
          );
        }
      } else if ( !sender || sender.credit < amount && mode === 'credit' ) {
        if (!sender) {
          console.log("Sender account not found");
        } else {
          console.log(
            "Sender account was found, but it has insufficient credit (get more credit dude!)"
          );
        }
      }

      // within a session, every operation must be completed, otherwise it will all be rolled back
      const senderUpdate = await Account.updateOne(
        { _id: id_sender },
        { $inc: mode === 'balance' ? { balance: -amount } : { credit: -amount } },
        { session }
      );

      const receiverUpdate = await Account.updateOne(
        { _id: id_receiver },
        { $inc: { balance: amount } },
        { session }
      );

      const transfer = {
        sender: id_sender,
        receiver: id_receiver,
        amount: amount,
      };

      // its needed to create the document since it doesnt exist yet
      const insertTransferResults = await Transfer.create([transfer], {
        session,
      });

      if (
        !senderUpdate.modifiedCount ||
        !receiverUpdate.modifiedCount ||
        insertTransferResults.length === 0
      ) {
        throw new Error(
          "Transaction failed: One or more operations did not succeed."
        );
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
};

module.exports = {
  getTransfers,
  getTransfersFromAccount,
  makeTransfer,
};
