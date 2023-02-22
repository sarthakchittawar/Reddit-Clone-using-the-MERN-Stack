const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    postid: {
        type: String,
        required: true
    }
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;