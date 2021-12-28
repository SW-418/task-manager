import mongoose from 'mongoose'
import validator from 'validator'
import {User} from "../user";

const { Schema } = mongoose

const schema = new Schema<User>({
    firstName: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    age: {
        type: Number,
        required: true,
        default: 0
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value: string) {
            if(!validator.isEmail(value)) {
                throw new Error("Email isn't valid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value: string) {
            if(value.toLowerCase().includes("password")) {
                throw new Error("Password cannot include 'password'")
            }
        }
    }
});

const UserDto = mongoose.model<User>("User", schema)

export { UserDto }