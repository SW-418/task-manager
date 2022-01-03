import {Task} from "../task";
import mongoose from "mongoose";

const { Schema } = mongoose

const taskSchema = new Schema<Task>({
    ownerId: {type: String, required: true},
    description: { type: String, required: true, trim: true },
    completed: { type: Boolean, required: false, default: false, ref: 'User ' }
}, {
    timestamps: true
});

const TaskDto = mongoose.model<Task>("Task", taskSchema)

export { TaskDto }
