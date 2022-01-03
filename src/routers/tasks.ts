import express from 'express'
import { TaskDto } from "../models/dtos/task-dto.js";
import { authenticate } from "../middleware/authenticate.js";
import {FilterQuery} from "mongoose";
import {Task} from "../models/task";

const TaskRouter = express.Router()

TaskRouter.post("/tasks", authenticate, async (req, res) => {
    const task = new TaskDto({
        ...req.body,
        ownerId: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})

TaskRouter.get("/tasks", authenticate, async (req, res) => {
    const filter:FilterQuery<Task> = { ownerId: req.user._id }

    if(req.query.hasOwnProperty("completed")) {
        filter.completed = req.query["completed"] === "true"
    }

    try {
        const limit = req.query["limit"]
        const skip = req.query["skip"]
        if(typeof limit != "string" || typeof skip != "string" ) {
            res.status(400).send("limit AND skip query parameters must be provided")
        } else {
            console.log(`Limit: ${limit} Skip: ${skip}`)
            const result = await TaskDto.find(filter).limit(parseInt(limit)).skip(parseInt(skip))
            res.send(result)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Unable to retrieve tasks")
    }
})

TaskRouter.get("/tasks/:id", authenticate, async (req, res) => {
    const _id = req.params.id
    try {
        const result = await TaskDto.findOne({ _id, ownerId: req.user._id })
        if(!result) {
            return res.status(404).send()
        }

        res.send(result)
    } catch (error) {
        res.status(500).send("Unable to retrieve task")
    }
})

TaskRouter.patch("/tasks/:id", authenticate, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every((item) => allowedUpdates.includes(item))

    if(!isValidUpdate) {
        return res.status(400).send("error: Invalid updates!")
    }

    try {
        const result = await TaskDto.findOne({ _id: req.params.id, ownerId: req.user._id })
        
        if(!result) {
            return res.status(404).send()
        }

        result.description = req.body.description ? req.body.description : result.description
        result.completed = req.body.completed != undefined ? req.body.completed : result.completed

        res.send(result)
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
})

TaskRouter.delete("/tasks/:id", authenticate, async (req, res) => {
    try{
        const result = await TaskDto.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id})
        if(!result) {
            return res.status(404).send()
        }
        res.send(result)
    } catch(error) {
        res.status(500).send(error)
    }
})

export { TaskRouter }