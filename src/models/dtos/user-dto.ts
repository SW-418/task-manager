import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import {IUser} from "../user"
import bcrypt from 'bcryptjs'

const { Schema } = mongoose

interface UserModel extends mongoose.Model<IUser> {
    findByCredentials(email: string, password: string): Promise<IUser>
    generateAuthToken(): Promise<string>
}

const schema = new Schema<IUser, UserModel>({
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
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

schema.methods.generateAuthToken = async function (): Promise<string> {
    const user = this

    const token = jwt.sign({_id: user._id.toString()}, 'secret')

    user.tokens = user.tokens.concat({ token })

    await user.save()

    return token
}

schema.statics.findByCredentials = async (email: string, password: string) => {
    const user = await UserDto.findOne({ email })
    const error = new Error("Unable to login")

    if(!user) {
        console.log("Didn't find user")
        throw error
    }

    const credentialMatches = await bcrypt.compare(password, user.password)

    if(!credentialMatches) {
        console.log("Credentials didn't match")
        throw error
    }
    return user
}

schema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const UserDto = mongoose.model<IUser, UserModel>("User", schema)

export { UserDto }