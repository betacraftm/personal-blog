import mongoose from 'mongoose'

const logSchema = new mongoose.Schema(
	{
		method: {
			type: String,
			required: true,
		},
		origin: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
)

export default mongoose.model('Log', logSchema)
