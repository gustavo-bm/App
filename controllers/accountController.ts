import { Request, Response } from "express";
import Account from '../models/accountModel';

const getAccounts = async (req: Request, res: Response) => {
    try {
        const accounts = await Account.find().populate('user');
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAccountById = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAccount = (req: Request, res: Response) => {
    try {
        const account = await Account.create(req.body);
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAccount = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const account = await Account.findByIdAndUpdate(id, req.body, { new: true }); // Return updated document
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAccount = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const account = await Account.findByIdAndDelete(id);
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount
};