const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const favCartSchema = new mongoose.Schema({
    userId : {
        type : ObjectID,
        ref : "User",
        required : [true, "Please input the food vendor ID"]
    },
    foodId : {
        type : ObjectID,
        ref : "Food",
        required : [true, "Please enter the food ID"]
    },
    foodName : {
        type : String
    },
    quantity : {
        type : Number,
        required : [true, "Please enter the food quantity"],
        min : 1,
        default : 1
    },
    unitPrice : {
        type : Number,
        default : 0
    },
    amount : Number
}, {
    timestamps : true
});

const Favorite = mongoose.model("Favorite", favCartSchema);

module.exports = Favorite;