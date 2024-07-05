import { StatusCodes } from 'http-status-codes'
import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'

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
