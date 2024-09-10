import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    rating: { type: Number, default: 0 },
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export default Post;
