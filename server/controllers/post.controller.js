import { StatusCodes } from 'http-status-codes'
import Post from '../models/post.model'

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
