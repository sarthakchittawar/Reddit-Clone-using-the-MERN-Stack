const mongoose = require("mongoose");

const SubGreddiitSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    tags: {
        type: Array
    },
    banned: {
        type: Array
    },
    mod: {
        type: String
    },
    followers: {
        type: Array
    },
    blockedusers: {
        type: Array
    },
    requests: {
        type: Array
    },
    posts: {
        type: Array
    },
    reports: {
        type: Array
    },
    left: {
        type: Array
    },
    date: {
        type: Date,
        required: true
    },
    image: {
        type: String
    }
});
// do reports & posts

const SubGreddiit = mongoose.model("SubGreddiit", SubGreddiitSchema);
module.exports = SubGreddiit;