import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    thumbnail: {
      type: String,
      default: ''
    },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1 });

export default mongoose.model('Category', categorySchema);
