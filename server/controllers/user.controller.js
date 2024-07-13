import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
export const test = (req, res) => {
	res.json({ message: 'Hello World' })
}

export const updateUser = async (req, res) => {
	try {
		if (req.user._id !== req.params.userId) {
			return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not allowed' })
		}

		if (req.body.password) {
			if (req.body.password.length < 6) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: 'Password must be at least 6 characters' })
			}
			req.body.password = bcryptjs.hashSync(req.body.password, 10)
		}

		if (req.body.username) {
			if (req.body.username < 7 || req.body.username > 20) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: 'Username must be between 7 and 20 characters' })
			}

			if (req.body.username.includes(' ')) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: 'Username cannot contain spaces' })
			}

			if (req.body.username !== req.body.username.toLowerCase()) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: 'Username must be lowercase' })
			}

			if (req.body.username.match(/[^a-zA-Z0-9]+/g)) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: 'Username can contain only letters and numbers' })
			}
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.params.userId,
			{
				$set: {
					username: req.body.username,
					email: req.body.email,
					profilePicture: req.body.profilePicture,
					password: req.body.password,
				},
			},
			{ new: true }
		)

		const { password, ...rest } = updatedUser._doc
		res.status(StatusCodes.OK).json(rest)
	} catch (error) {
		console.log('Error in updateUser')
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: error.message })
	}
}

export const deleteUser = async (req, res) => {
	try {
		if (req.user._id !== req.params.userId) {
			return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not allowed' })
		}

		await User.findByIdAndDelete(req.params.userId)
		res.status(StatusCodes.OK).json({ message: 'User has been deleted' })
	} catch (error) {
		console.log('Error in delete user', error.message)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
	}
}

export const signout = (req, res) => {
	try {
		res
			.clearCookie('access_token')
			.status(StatusCodes.OK)
			.json('User has been signed out')
	} catch (error) {
		console.log('Error in signout', error.message)
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: error.message })
	}
}
