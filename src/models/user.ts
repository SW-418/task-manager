export class User {
    firstName: string
    surname: string
    age: number
    email: string
    password: string

    constructor(firstName: string, surname: string, age: number, email: string, password: string) {
        this.firstName = firstName;
        this.surname = surname;
        this.age = age;
        this.email = email
        this.password = password
    }
}
