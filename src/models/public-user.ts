import { IUser } from "./user";

export class PublicUser {
    _id: string
    firstName: string
    surname: string
    age: number
    email: string

    constructor(id: string, user: IUser) {
        this._id = id;
        this.firstName = user.firstName;
        this.surname = user.surname;
        this.age = user.age;
        this.email = user.email;
    }
}
