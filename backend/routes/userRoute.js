import express from 'express'
import { getUserData, login, logout, registration } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'

const userRouter = express.Router()

userRouter.post("/register", registration)
userRouter.post("/login", login)
userRouter.post("/logout", userAuth, logout)
userRouter.get("/getUserData", userAuth, getUserData)

export default userRouter