import mongoose from 'mongoose'
import validator from 'validator'
import {User} from "../user"
import bcrypt from 'bcryptjs'

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

schema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const UserDto = mongoose.model<User>("User", schema)

export { UserDto }