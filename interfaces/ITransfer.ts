import { Schema } from "mongoose";

interface ITransfer extends Document {
    sender: Schema.Types.ObjectId,
    receiver: Schema.Types.ObjectId,
    amount: number;
}

export default ITransfer;