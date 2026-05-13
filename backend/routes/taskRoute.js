import express from 'express'
import { createTask, deleteTask, getTaskData } from '../controllers/taskController.js'
import userAuth from '../middleware/userAuth.js'

const taskRouter = express.Router()

taskRouter.post("/createTask", userAuth, createTask)
taskRouter.get("/getTaskData", userAuth, getTaskData)
taskRouter.post("/deleteTask", userAuth, deleteTask)

export default taskRouter