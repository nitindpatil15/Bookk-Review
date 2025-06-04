import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    book: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true 
    },
    user: { 
        type: String, 
        required: true 
    }, 
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    comment: { 
        type: String, 
        required: true 
    },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
