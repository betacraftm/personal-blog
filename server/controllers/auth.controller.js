import { StatusCodes } from 'http-status-codes'
import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signup = async (req, res) => {
	try {
		const { username, email, password } = req.body
		if (
			!username ||
			!email ||
			!password ||
			username === '' ||
			email === '' ||
			password === ''
		) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'All field are required' })
		}

		const dupUser = await User.findOne({ username })
		if (dupUser)
			return res
				.status(StatusCodes.CONFLICT)
				.json({ message: 'Username has been taken' })

		const hashedPassword = bcryptjs.hashSync(password, 10)

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		})

		await newUser.save()

		res
			.status(StatusCodes.CREATED)
			.json({ message: `User ${username} created` })
	} catch (error) {
		console.log('Error in signup route')
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
	}
}

export const signin = async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password || email === '' || password === '') {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'All field are required' })
		}

		const validUser = await User.findOne({ email })
		if (!validUser) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'User not found' })
		}

		const validPassword = bcryptjs.compareSync(password, validUser.password)

		if (!validPassword) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Invalid password' })
		}

		const token = jwt.sign(
			{ _id: validUser._id, username: validUser.username },
			process.env.JWT_SECRET
		)

		const { password: pwd, ...rest } = validUser._doc

		res
			.status(StatusCodes.OK)
			.cookie('access_token', token, { httpOnly: true })
			.json(rest)
	} catch (error) {
		console.log('Error in signin route')
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
	}
}
