import express from 'express'
import { authenticate } from '../middleware/authenticate.js';
import { UserDto } from "../models/dtos/user-dto.js";
import {ObjectId} from "mongodb";

const UserRouter = express.Router()

UserRouter.post("/users", async (req, res) => {
    const user = new UserDto(req.body)

    try {
        await user.save();
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(error) {
        console.log(error)
        res.status(400).send(error)
    }
})

// DEV ONLY
UserRouter.get("/users", async (req, res) => {
    try{
        const result = await UserDto.find();
        res.send(result)
    } catch(error) {
        res.status(500).send("Unable to retrieve users")
    }
})

UserRouter.get("/users/me", authenticate, async (req, res) => {
    res.send(req.user)
})

UserRouter.get("/users/:id", async (req, res) => {
    try {
        const result = await UserDto.findById(req.params.id)
        if(!result) {
            return res.status(404).send()
        }
        res.send(result)
    } catch(error) {
        res.status(500).send("Unable to retrieve user")
    }
})

UserRouter.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'surname', 'age', 'password']
    const isValidUpdate = updates.every((item) => allowedUpdates.includes(item))

    if(!isValidUpdate) {
        return res.status(400).send("error: Invalid updates!")
    }

    try {
        const result = await UserDto.findById(req.params.id)

        if(!result) {
            return res.status(404).send()
        }

        // TODO: There's deffo a more elegant, extendable way to achieve this
        result.firstName = req.body.firstName ? req.body.firstName : result.firstName 
        result.surname = req.body.surname ? req.body.surname : result.surname 
        result.age = req.body.age ? req.body.age : result.age
        result.email = req.body.email ? req.body.email : result.email
        result.password = req.body.password ? req.body.password : result.password

        await result.save()

        res.send(result)
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
})

UserRouter.delete("/users/:id", async (req, res) => {
    try{
        const result = await UserDto.findByIdAndDelete(req.params.id)
        if(!result) {
            return res.status(404).send()
        }
        res.send(result)
    } catch(error) {
        res.status(500).send(error)
    }
})

UserRouter.post("/users/login", async (req, res) => {
    try {
        const user = await UserDto.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch(error) {
        console.log(error)
        res.status(400).send()
    }
})

UserRouter.post("/users/logout", authenticate, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((current: JWTToken) => current.token != req.token)
        await req.user.save()
        res.send()
    } catch(error) {
        res.status(500).send("Error occurred trying to log out")
    }
})

UserRouter.post("/users/logoutall", authenticate, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(error) {
        res.status(500).send("Error occurred trying to log out")
    }
})

export { UserRouter }

class JWTToken {
    token: string
    _id: ObjectId

    constructor(token: string, id: ObjectId) {
        this.token = token;
        this._id = id;
    }
}