const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    rating : {
        type : Number
    },
    review : {
        type : String
    }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;