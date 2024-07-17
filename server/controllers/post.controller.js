import { StatusCodes } from 'http-status-codes'
import Post from '../models/post.model.js'

export const createPost = async (req, res) => {
	try {
		if (!req.user.isAdmin) {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ message: 'You are not allowed to create a post' })
		}

		if (!req.body.title || !req.body.content) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Please provide all requied field' })
		}

		const slug = req.body.title
			.split(' ')
			.join('-')
			.toLowerCase()
			.replace(/[^a-zA-Z0-9-]/g, '')

		const duplicatePost = await Post.findOne({ title: req.body.title })
		if (duplicatePost) {
			return res
				.status(StatusCodes.CONFLICT)
				.json({ message: 'This title has been used' })
		}

		const newPost = new Post({
			...req.body,
			slug,
			userId: req.user._id,
		})

		const savedPost = await newPost.save()

		res.status(StatusCodes.CREATED).json(savedPost)
	} catch (error) {
		console.log('Error in create post', error.message)
		res.status(StatusCodes).json({ message: error.message })
	}
}

export const getPosts = async (req, res) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0
		const limit = parseInt(req.query.limit) || 9
		const sortDirection = req.query.order === 'asc' ? 1 : -1
		const posts = await Post.finds(
			...(req.query.userId && { userId: req.query.userId }),
			...(req.query.category && { category: req.query.category }),
			...(req.query.slug && { slug: req.query.slug }),
			...(req.query.postId && { _id: req.query.postId }),
			...(req.query.searchTerm && {
				$or: [
					{ title: { $regex: req.query.searchTerm, $option: 'i' } },
					{ content: { $regex: req.query.searchTerm, $option: 'i' } },
				],
			})
		)
			.sort({ updateAt: sortDirection })
			.skip(startIndex)
			.limit(limit)

		const totalPosts = await Post.countDocuments()

		const now = new Date()

		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		)

		const lastMonthPosts = await Post.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		})

		res.status(StatusCodes.OK).json({
			posts,
			totalPosts,
			lastMonthPosts,
		})
	} catch (error) {
		console.log('Error in getPosts', error.message)
		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: error.message })
	}
}
