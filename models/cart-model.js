const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema({
    userId : {
        type : ObjectID,
        ref : "User",
        required : [true, "Please input the vendor,s ID"]
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

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;