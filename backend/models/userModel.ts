import { Document, model, Schema } from 'mongoose';
import IUser from '../interfaces/IUser';

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "User name is required"]
        },
        email: {
            type: String,
            required: [true, "User email is required"],
            unique: true
        },
        cpf: {
            type: String,
            required: [true, "User CPF is required"],
            unique: true
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
