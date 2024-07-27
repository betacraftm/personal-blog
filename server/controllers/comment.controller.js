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

export const getPostComments = async (req, res) => {
	try {
		const comment = await Comment.find({ postId: req.params.postId }).sort({
			createdAt: -1,
		})
		res.status(StatusCodes.OK).json(comment)
	} catch (error) {
		console.log('Error in getPostComments', error.message)
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: error.message })
	}
}

export const likeComment = async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.commentId)
		if (!comment) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Comment not found' })
		}
		const userIndex = comment.likes.indexOf(req.user._id)
		if (userIndex === -1) {
			comment.numberOfLikes += 1
			comment.likes.push(req.user._id)
		} else {
			comment.numberOfLikes -= 1
			comment.likes.splice(userIndex, 1)
		}
		await comment.save()
		res.status(StatusCodes.OK).json(comment)
	} catch (error) {
		console.log('Error in likeComment', error.message)
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: error.message })
	}
}
