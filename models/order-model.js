const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
    userId : {
        type : ObjectID,
        ref : "User",
    },
    cartId : [{
        type : ObjectID,
        ref : "Cart"
    }],
    totalAmount : {
        type : Number,
        default : 0
    },
});

orderSchema.pre(/^find/, function (next) {
    this.populate([
        {
        path: "userId",
        select: "fullName address phoneNumber email",
        }
    ]);
    next();
});

orderSchema.pre(/^find/, function (next) {
    this.populate([
        {
        path: "cartId",
        select: "foodName quantity amount",
        }
    ]);
    next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;