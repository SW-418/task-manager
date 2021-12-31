export interface IUser {
    firstName: string
    surname: string
    age: number
    email: string
    password: string
    tokens: string[]

    findByCredentials(email: string, password: string): Promise<IUser>
    generateAuthToken(): Promise<string>
}
