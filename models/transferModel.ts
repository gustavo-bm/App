import { model, Schema } from "mongoose";
import ITransfer from "../interfaces/ITransfer";

const trasnferModel = new Schema<ITransfer>({
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    },
    {
    timestamps: true
    }
);

const Transfer = model<ITransfer>('Transfer', trasnferModel);
export default Transfer;