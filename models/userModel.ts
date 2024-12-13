import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    age: number;
    savings: number;
    photo: string;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "User name is required"]
        },
        age: {
            type: Number,
            required: true,
        },
        savings: {
            type: Number,
            required: true,
            default: 0
        },
        photo: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const User = model<IUser>('User', userSchema);
export default User;
