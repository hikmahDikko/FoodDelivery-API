const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema({
    userId : {
        type : ObjectID,
        ref : "User",
        required : [true, "Please input the product vendor ID"]
    },
    productId : {
        type : ObjectID,
        ref : "Product",
        required : [true, "Please enter the product ID"]
    },
    productName : {
        type : String
    },
    quantity : {
        type : Number,
        required : [true, "Please enter the quantity number"],
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

cartSchema.pre("save", function (next) {
    this.populate({
      path: "productId",
      select: "name",
    });
    next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;