import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },

    title: { type: String, required: true },
    description: { type: String, required: true }
    
}, { timestamps: true })

const TaskModel = mongoose.models.Task || mongoose.model("Task", taskSchema)

export default TaskModel