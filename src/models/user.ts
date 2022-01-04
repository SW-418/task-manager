import {PublicUser} from "./public-user";

export interface IUser {
    firstName: string
    surname: string
    age: number
    email: string
    password: string
    tokens: string[]
    avatar: Buffer

    findByCredentials(email: string, password: string): Promise<IUser>
    generateAuthToken(): Promise<string>
    getPublicProfile(): PublicUser
}
