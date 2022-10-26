const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const favCartSchema = new mongoose.Schema({
    userId : {
        type : ObjectID,
        ref : "User",
        required : [true, "Please input the product vendor ID"]
    },
    foodId : {
        type : ObjectID,
        ref : "Food",
        required : [true, "Please enter the product ID"]
    },
    foodName : {
        type : String
    },
    quantity : {
        type : Number,
        required : [true, "Please enter the quantity number"],
        min : 1,
        default : 1
    },
    deliveryFee:{
        type : Number
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