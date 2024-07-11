import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

export const verifyToken = (req, res, next) => {
	try {
		const token = req.cookies.access_token
		if (!token) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: 'Unauthorized' })
		}
		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: 'Invalid token' })
			}
			req.user = user
			next()
		})
	} catch (error) {
		console.log('Error in verifyUser')
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: error.message })
	}
}
