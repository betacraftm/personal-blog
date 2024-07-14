import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from './config/db.config.js'
import userRoute from './routes/user.routes.js'
import authRoute from './routes/auth.routes.js'
import postRoute from './routes/post.routes.js'
import credentials from './middlewares/credentials.middleware.js'
import cors from 'cors'
import corsOptions from './config/corsOption.config.js'
import cookieParser from 'cookie-parser'
dotenv.config()
connectDB()
const app = express()
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)

mongoose.connection.once('open', () => {
	console.log('Connected to DB')
	app.listen(8904, () => {
		console.log(`Server is running on PORT 8904`)
	})
})
