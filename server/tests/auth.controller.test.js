import { StatusCodes } from 'http-status-codes'
import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'

export const signupTest = async (req, res) => {
	try {
		const { username, email, password } = req.body
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
		console.log('Error in signup test route')
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
	}
}

export const getUsersTest = async (req, res) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0
		const limit = parseInt(req.query.limit) || 9
		const sortDirection = req.query.sort === 'asc' ? 1 : -1

		const users = await User.find()
			.sort({ createdAt: sortDirection })
			.skip(startIndex)
			.limit(limit)

		const userWithOutPassword = users.map((user) => {
			const { password, ...rest } = user._doc
			return rest
		})

		const totalUser = await User.countDocuments()

		const now = new Date()

		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		)

		const lastMonthUser = await User.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		})

		res.status(StatusCodes.OK).json({
			users: userWithOutPassword,
			totalUser,
			lastMonthUser,
		})
	} catch (error) {
		console.log('Error in getUsers test route', error.message)
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: error.message })
	}
}

export const deleteUserTest = async (req, res) => {
	try {
		const foundUser = await User.findById(req.params.userId)
		if (!foundUser) {
			res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
		} else {
			await User.deleteOne(foundUser)
			res.status(StatusCodes.OK).json({ message: 'User has been deleted' })
		}
	} catch (error) {
		console.log('Error in delete user', error.message)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
	}
}

export const updateUserTest = async (req, res) => {
	try {
		const foundUser = await User.findById(req.params.userId)
		if (!foundUser) {
			res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
		} else {
			const updatedUser = await User.updateOne(
				foundUser,
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
			const { password, ...rest } = foundUser._doc
			res.status(StatusCodes.OK).json(rest)
		}
	} catch (error) {
		console.log('Error in updateUser')
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: error.message })
	}
}
