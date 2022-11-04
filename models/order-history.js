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
    reviews : [{
        type : ObjectID,
        ref : "Review"
    }]
},{
    timestamps : true
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
        path: "reviews",
        select: "rating review",
        }
    ]);
    next();
});

const OrderedItems = mongoose.model("OrderedItems", orderedItemsSchema);

module.exports =   OrderedItems;