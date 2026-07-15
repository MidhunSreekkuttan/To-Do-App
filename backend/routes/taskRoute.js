import express from 'express'
import { changeTaskData, createTask, deleteTask, getTaskData } from '../controllers/taskController.js'
import userAuth from '../middleware/userAuth.js'

const taskRouter = express.Router()

taskRouter.post("/createTask", userAuth, createTask)
taskRouter.get("/getTaskData", userAuth, getTaskData)
taskRouter.put("/changeStatus/:taskId", userAuth, changeTaskData)
taskRouter.post("/deleteTask", userAuth, deleteTask)

export default taskRouter