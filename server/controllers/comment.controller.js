import { StatusCodes } from 'http-status-codes'
import Comment from '../models/comment.model.js'

export const createComment = async (req, res) => {
	try {
		const { content, postId, userId } = req.body
		if (userId !== req.user._id) {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ message: 'You are not allowed to create this comment' })
		}

		if (content.length === 0) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Comment is not allowed to be empty' })
		}

		const newComment = Comment({
			content,
			postId,
			userId,
		})

		await newComment.save()

		res.status(StatusCodes.CREATED).json(newComment)
	} catch (error) {
		console.log('Error in createComment', error.message)
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: error.message })
	}
}
