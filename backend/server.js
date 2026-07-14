import express from 'express'
import dotenv from 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dataBase from './data-base/connectBD.js'
import userRouter from './routes/userRoute.js'
import taskRouter from './routes/taskRoute.js'
import dns from "dns"

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express()

const PORT = process.env.PORT || 3000

//midlewares
app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(cookieParser())

//api end-points
app.use("/api/user", userRouter) //user routes
app.use("/api/task", taskRouter) //task routes

await dataBase()

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})