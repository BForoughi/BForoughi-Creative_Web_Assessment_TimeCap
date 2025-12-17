import mongoose, { Schema } from "mongoose";

const photoSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    imageUrl:{
        type: String,
        required: true
    },
    cloudinaryId:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Photo', photoSchema)