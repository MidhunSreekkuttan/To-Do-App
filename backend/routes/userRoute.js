import express from 'express'
import { forgotPassword, getUserData, login, registration, resetPassword, updateProfile } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.post("/register", registration)
userRouter.post("/login", login)
userRouter.get("/getUserData", userAuth, getUserData)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/reset-password/:token", resetPassword)

userRouter.put("/updateProfilePic", userAuth, upload.single("image"), updateProfile)

export default userRouter