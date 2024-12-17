import { Request, Response } from "express";
import Account from "../models/accountModel";
import IAccount from "../interfaces/IAccount";

const getAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const accounts: IAccount[] = await Account.find().populate("user");
    res.status(200).json(accounts);
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

const getAccountById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const account: IAccount | null = await Account.findById(id);
    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }
    res.status(200).json(account);
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

const createAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const account = await Account.create(req.body);
    res.status(200).json(account);
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

const updateAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const account: IAccount | null = await Account.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ); // Return updated document
    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }
    res.status(200).json(account);
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

const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const account: IAccount | null = await Account.findByIdAndDelete(id);
    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }
    res.status(200).json({ message: "Account deleted successfully" });
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

const makeTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {};

module.exports = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
};
