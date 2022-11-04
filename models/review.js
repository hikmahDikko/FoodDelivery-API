const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    userId : {
        type : ObjectID,
        ref : "User",
    },
    rating : {
        type : Number,
        min : 1,
        max : 5,
        default : 1
    },
    review : {
        type : String
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;