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

export const editComment = async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.commentId)
		if (!comment) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Comment not found' })
		}

		if (comment.userId !== req.user.id && !req.user.isAdmin) {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ message: 'You are not allowed to edit this comment' })
		}

		const editedComment = await Comment.findByIdAndUpdate(
			req.params.commentId,
			{ content: req.body.content },
			{ new: true }
		)

		res.status(StatusCodes.OK).json(editedComment)
	} catch (error) {
		console.log('Error in editComment', error.message)
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: error.message })
	}
}

export const deleteComment = async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.commentId)
		if (!comment) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Comment not found' })
		}

		if (comment.userId !== req.user.id && !req.user.isAdmin) {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ message: 'You are not allowed to delete this comment' })
		}

		await Comment.findByIdAndDelete(req.params.commentId)

		res.status(StatusCodes.OK).json('Comment has been deleted')
	} catch (error) {
		console.log('Error in deleteComment', error.message)
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: error.message })
	}
}

export const getComments = async (req, res) => {
	try {
		if (!req.user.isAdmin) {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ message: 'You are not allowed to get all comments' })
		}

		const startIndex = parseInt(req.query.startIndex) || 0
		const limit = parseInt(req.query.limit) || 9
		const sortDirection = req.query.sort === 'asc' ? 1 : -1
		const comments = await Comment.find()
			.sort({ createdAt: sortDirection })
			.skip(startIndex)
			.limit(limit)
		const totalComments = await Comment.countDocuments()
		const now = new Date()
		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		)
		const lastMonthComments = await Comment.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		})

		res
			.status(StatusCodes.OK)
			.json({ comments, totalComments, lastMonthComments })
	} catch (error) {
		console.log('Error in getComments', error.message)
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: error.message })
	}
}
