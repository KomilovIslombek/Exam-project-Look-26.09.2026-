import express from 'express'
import cors from 'cors'
import chalk from 'chalk'
import dotenv from 'dotenv'
dotenv.config()

import userRouter from './routes/user.routes.js'
import orderRouter from './routes/order.routes.js'
import foodRouter from './routes/food.routes.js'

const app = express()
app.use(cors({origin: '*'})) // Allowing clients to interact with apis
app.use(express.json())

const PORT = process.env.PORT || 5000

app.use('/api/v1', userRouter)
app.use('/api/v1', orderRouter)
app.use('/api/v1', foodRouter)


app.listen(PORT, () => {
    console.log(`Server is aggressively running on port ${chalk.green(PORT)}`)
})