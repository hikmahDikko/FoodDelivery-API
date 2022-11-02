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
    FavoriteId : [{
        type : ObjectID,
        ref : "Favorite"
    }],
    totalAmount : {
        type : Number,
        default : 0
    },
    comments : [{
        type : ObjectID,
        ref : "Comment"
    }]
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

orderedItemsSchema.pre(/^find/, function (next) {
    this.populate([
        {
        path: "FavoriteId",
        select: "foodName quantity amount",
        }
    ]);
    next();
});

orderedItemsSchema.pre(/^find/, function (next) {
    this.populate([
        {
        path: "comments",
        select: "ratings review",
        }
    ]);
    next();
});

const OrderedItemsSchema = mongoose.model(" OrderedItemsSchema", orderedItemsSchema);

module.exports =   OrderedItemsSchema;