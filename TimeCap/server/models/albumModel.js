import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title:{
            type: String,
            required: true,
            trim: true
        },
        lockedUntil:{
            type: Date,
            default: null
        }
    },
    {timestamps: true}
)

export default mongoose.model("Album", albumSchema)