const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    vendor : {
        type: mongoose.Schema.ObjectId,
        ref : "User",
        required: [true, "Please enter your ID to add to the food menu"],
    },
    name : {
        type : String,
        required : [true, "Please enter the food name"],
    },
    price : {
        type : Number,
        required : [true, "Please enter the amount of the food"]
    },
    category : {
        type : String,
        required : [true, "Please enter the food category"],
    },
    foodImage : {
        type : String,
        required : [true, "Please upload the food image"],
    }
},{
    timestamps : true,
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;