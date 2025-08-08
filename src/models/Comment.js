const Comment = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    text: { type: String },
    created_at: { type: Date, default: Date.now }
});
