import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    albumId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
        default: null,
        index: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    cloudinaryId:{
        type: String,
        required: true
    },
},
{timestamps: true}
)

export default mongoose.model('Photo', photoSchema)