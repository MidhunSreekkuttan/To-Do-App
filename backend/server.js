import express from 'express'
import dotenv from 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dataBase from './data-base/connectBD.js'
import userRouter from './routes/userRoute.js'

const app = express()

const PORT = process.env.PORT || 3000

//midlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//api end-points
app.use("/api/user", userRouter) //user routes

await dataBase()

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})