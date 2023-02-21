const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema ({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    }
});

const Follow = mongoose.model("Follow", FollowSchema);
module.exports = Follow;