import express from 'express'
import {TaskDto} from "../models/dtos/task-dto.js";

const TaskRouter = express.Router()

TaskRouter.post("/tasks", async (req, res) => {
    const task = new TaskDto(req.body)

    try {
        const result = await task.save()
        res.status(201).send(result)
    } catch(error) {
        res.status(400).send(error)
    }
})

TaskRouter.get("/tasks", async (req, res) => {
    try {
        const result = await TaskDto.find()
        res.send(result)
    } catch (error) {
        res.status(500).send("Unable to retrieve tasks")
    }
})

TaskRouter.get("/tasks/:id", async (req, res) => {
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

TaskRouter.patch("/tasks/:id", async (req, res) => {
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

TaskRouter.delete("/tasks/:id", async (req, res) => {
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

export { TaskRouter }