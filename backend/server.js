import express from 'express'
import dotenv from 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dataBase from './data-base/connectBD.js'

const app = express()

const PORT = process.env.PORT || 3000

//midlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//api end-points

await dataBase()

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})