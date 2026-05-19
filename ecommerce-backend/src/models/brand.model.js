import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    logo: {
      type: String,
      default: ''
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        trim: true
      }
    ]
  },
  { timestamps: true }
);

brandSchema.index({ name: 1 });

export default mongoose.model('Brand', brandSchema);
