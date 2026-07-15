import express from 'express'
import { forgotPassword, getUserData, login, registration, resetPassword } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'

const userRouter = express.Router()

userRouter.post("/register", registration)
userRouter.post("/login", login)
userRouter.get("/getUserData", userAuth, getUserData)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/reset-password/:token", resetPassword)

export default userRouter