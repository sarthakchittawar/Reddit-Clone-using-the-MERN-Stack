const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    subgreddiit: {
        type: String,
        required: true
    },
    upvotes: {
        type: Array,
        required: true
    },
    downvotes: {
        type: Array,
        required: true
    },
    comments: {
        type: Array
    }
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;