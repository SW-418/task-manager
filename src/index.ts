import express from 'express'
import { createMongoConnection } from "./db/mongoose.js";
import {UserRouter} from "./routers/user.js";
import {TaskRouter} from "./routers/tasks.js";

const app = express()
const port = process.env.PORT

createMongoConnection()

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

app.listen(port, () => {
    console.log(`App started on port ${port}`)
})
