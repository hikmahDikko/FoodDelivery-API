const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    userId : {
        type : ObjectID,
        ref : "User",
    },
    rating : {
        type : Number
    },
    review : {
        type : String
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;