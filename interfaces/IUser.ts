export interface IUser extends Document {
    name: string;
    age: number;
    savings: number;
    photo: string;
}

export default IUser;