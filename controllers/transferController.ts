import ITransfer from "../interfaces/ITransfer";
import Transfer from "../models/transferModel";
import { Request, Response } from "express";

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

module.exports = {
    getTransfers,
    getTransfersFromAccount
}