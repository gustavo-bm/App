import { model, Schema } from "mongoose";
import IEvent from "../interfaces/IEvent";


const eventSchema = new Schema({
    name: {
        type: String,
        required: [true, "Event name is required"]
    },
    description: {
        type: String,
        required: [true, "Event description is required"]
    },
    date: {
        type: Date,
        required: [true, "Event date is required"]
    },
    location: {
        type: String,
        required: [true, "Event location is required"]
    },
}, {
    timestamps: true
});

const Event = model<IEvent>('Event', eventSchema);
export default Event;