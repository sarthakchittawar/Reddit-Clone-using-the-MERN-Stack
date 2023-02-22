const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    reportedby: {
        type: String,
        required: true
    },
    reporteduser: {
        type: String,
        required: true
    },
    concern: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    }
});

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;