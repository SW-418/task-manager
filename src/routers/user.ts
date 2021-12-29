import express from 'express'
import {UserDto} from "../models/dtos/user-dto.js";

const UserRouter = express.Router()

UserRouter.post("/users", async (req, res) => {
    const user = new UserDto(req.body)

    try {
        await user.save();
        res.status(201).send(user)
    } catch(error) {
        console.log(error)
        res.status(400).send(error)
    }
})

UserRouter.get("/users", async (req, res) => {
    try{
        const result = await UserDto.find();
        res.send(result)
    } catch(error) {
        res.status(500).send("Unable to retrieve users")
    }
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

export { UserRouter }
