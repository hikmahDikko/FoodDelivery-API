const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const orderedItemsSchema = new mongoose.Schema({
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
},{
    timestamps : true
});

orderedItemsSchema.pre(/^find/, function (next) {
    this.populate([
        {
        path: "userId",
        select: "fullName address phoneNumber email",
        }
    ]);
    next();
});

orderedItemsSchema.pre(/^find/, function (next) {
    this.populate([
        {
        path: "cartId",
        select: "foodName quantity amount",
        }
    ]);
    next();
});

const OrderedItemsSchema = mongoose.model(" OrderedItemsSchema", orderedItemsSchema);

module.exports =   OrderedItemsSchema;