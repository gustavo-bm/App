import { Request, Response } from "express";
import Event from "../models/eventModel";


const getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const Events = await Event.find();
        res.status(200).json(Events);
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

const getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        res.status(200).json(event);
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

const createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await Event.create(req.body);
        res.status(200).json(event);
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

const updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndUpdate(id, req.body, { new: true }); // Return updated document
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        res.status(200).json(event);
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

const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        res.status(200).json({ message: "Event deleted successfully" });
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

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};