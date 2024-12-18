import { Document } from "mongoose";

interface IEvent extends Document{
    id: number;
    name: string;
    description: string;
    date: string;
    location: string;
}

export default IEvent; 