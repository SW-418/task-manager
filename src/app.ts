import express from 'express'
import { createMongoConnection } from "./db/mongoose";
import {UserRouter} from "./routers/user";
import {TaskRouter} from "./routers/tasks";

const ExpressApplication = express()

createMongoConnection()

ExpressApplication.use(express.json())
ExpressApplication.use(UserRouter)
ExpressApplication.use(TaskRouter)

export { ExpressApplication }