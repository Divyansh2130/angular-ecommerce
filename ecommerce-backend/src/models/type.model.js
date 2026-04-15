import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        slug: {
            type: String,
            required: true
        },

        logo: {
            type: String
        },

        isFeatured: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

brandSchema.index({name:1,slug:1});
export default mongoose.model('Brand', brandSchema);