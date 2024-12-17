export interface IUser extends Document {
    name: string;
    email: string;
    cpf: string;
    age: number;
    savings: number;
    photo: string;
}

export default IUser;