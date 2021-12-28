import express from 'express'
import { createMongoConnection } from "./db/mongoose.js";
import {UserDto} from "./models/dtos/user-dto.js";
import {TaskDto} from "./models/dtos/task-dto.js";

const app = express()
const port = process.env.PORT || 3000
createMongoConnection()

app.use(express.json())

app.post("/users", async (req, res) => {
    const user = new UserDto(req.body)

    try {
        await user.save();
        res.status(201).send(user)
    } catch(error) {
        console.log(error)
        res.status(400).send(error)
    }
})

app.get("/users", async (req, res) => {
    try{
        const result = await UserDto.find();
        res.send(result)
    } catch(error) {
        res.status(500).send("Unable to retrieve users")
    }
})

app.get("/users/:id", async (req, res) => {
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

app.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'surname', 'age', 'password']
    const isValidUpdate = updates.every((item) => allowedUpdates.includes(item))

    if(!isValidUpdate) {
        return res.status(400).send("error: Invalid updates!")
    }

    try {
        const result = await UserDto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if(!result) {
            return res.status(404).send()
        }
        res.send(result)
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
})

app.delete("/users/:id", async (req, res) => {
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

app.post("/tasks", async (req, res) => {
    const task = new TaskDto(req.body)

    try {
        const result = await task.save()
        res.status(201).send(result)
    } catch(error) {
        res.status(400).send(error)
    }
})

app.get("/tasks", async (req, res) => {
    try {
        const result = await TaskDto.find()
        res.send(result)
    } catch (error) {
        res.status(500).send("Unable to retrieve tasks")
    }
})

app.get("/tasks/:id", async (req, res) => {
    try {
        const result = await TaskDto.findById(req.params.id)
        if(!result) {
            return res.status(404).send()
        }
        res.send(result)
    } catch (error) {
        res.status(500).send("Unable to retrieve task")
    }
})

app.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every((item) => allowedUpdates.includes(item))

    if(!isValidUpdate) {
        return res.status(400).send("error: Invalid updates!")
    }

    try {
        const result = await TaskDto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if(!result) {
            return res.status(404).send()
        }
        res.send(result)
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
})

app.delete("/tasks/:id", async (req, res) => {
    try{
        const result = await TaskDto.findByIdAndDelete(req.params.id)
        if(!result) {
            return res.status(404).send()
        }
        res.send(result)
    } catch(error) {
        res.status(500).send(error)
    }
})

app.listen(port, () => {
    console.log("App started...")
})
