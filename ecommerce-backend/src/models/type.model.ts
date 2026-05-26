import mongoose from 'mongoose';

const typeSchema = new mongoose.Schema(
	{
		category: {
			type: String,
			required: true,
			trim: true,
			index: true
		},
		image: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			required: true,
			trim: true
		}
	},
	{ timestamps: true }
);

typeSchema.index({ category: 1, name: 1 });

export default mongoose.model('Type', typeSchema);