import { Request, Response } from 'express';
import User from '../models/userModel';


const getUsers = async (req: Request, res: Response): Promise<any | typeof User> => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (Request: Request, res: Response): Promise<any | typeof User> => {
    try {
        const { id } = Request.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (Request: Request, res: Response): Promise<void> => {
    try {
        const user = await User.create(Request.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (Request: Request, res: Response): Promise<any | typeof User> => {
    try {
        const { id } = Request.params;
        const user = await User.findByIdAndUpdate(id, Request.body, { new: true }); // Return updated document
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (Request: Request, res: Response): Promise<any | typeof User> => {
    try {
        const { id } = Request.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};