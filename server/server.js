import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from './config/db.config.js'
import userRoutes from './routes/user.routes.js'

dotenv.config()
connectDB()
const app = express()

app.use('/api/user', userRoutes)

mongoose.connection.once('open', () => {
	console.log('Connected to DB')
	app.listen(8904, () => {
		console.log(`Server is running on PORT 8904`)
	})
})
