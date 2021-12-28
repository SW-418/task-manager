import {Task} from "../task";
import mongoose from "mongoose";

const { Schema } = mongoose

const taskSchema = new Schema<Task>({
    description: { type: String, required: true, trim: true },
    completed: { type: Boolean, required: false, default: false }
});

const TaskDto = mongoose.model<Task>("Task", taskSchema)

export { TaskDto }
