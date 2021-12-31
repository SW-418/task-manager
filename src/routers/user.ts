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

UserRouter.patch("/users/me", authenticate, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'surname', 'age', 'password']
    const isValidUpdate = updates.every((item) => allowedUpdates.includes(item))

    if(!isValidUpdate) {
        return res.status(400).send("error: Invalid updates!")
    }

    try {
        req.user.firstName = req.body.firstName ? req.body.firstName : req.user.firstName
        req.user.surname = req.body.surname ? req.body.surname : req.user.surname
        req.user.age = req.body.age ? req.body.age : req.user.age
        req.user.email = req.body.email ? req.body.email : req.user.email
        req.user.password = req.body.password ? req.body.password : req.user.password

        await req.user.save()

        res.send(req.user)
    } catch(error) {
        res.status(500).send(error)
    }
})

UserRouter.delete("/users/me", authenticate, async (req, res) => {
    try{
        await req.user.remove()
        res.send(req.user)
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