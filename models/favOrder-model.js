const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const FavOrderSchema = new mongoose.Schema({
    userId : {
        type : ObjectID,
        ref : "User",
    },
    cartId : [{
        type : ObjectID,
        ref : "Favorite"
    }],
    deliveryFee : {
        type : Number
    },
    totalAmount : {
        type : Number,
        default : 0
    },
});

FavOrderSchema.pre(/^find/, function (next) {
    this.populate([
        {
        path: "userId",
        select: "fullName address phoneNumber email",
        }
    ]);
    next();
});

FavOrderSchema.pre(/^find/, function (next) {
    this.populate([
        {
        path: "cartId",
        select: "foodName quantity amount",
        }
    ]);
    next();
});

const FavoriteOrder = mongoose.model("FavoriteOrder", FavOrderSchema);

module.exports = FavoriteOrder;