const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    vendor : {
        type: mongoose.Schema.ObjectId,
        ref : "User",
        required: [true, "Please enter your ID to upload a product"],
    },
    name : {
        type : String,
        required : [true, "Please enter the product name"],
    },
    description : {
        type : String,
        required : [true, "Please enter the product description"]
    },
    price : {
        type : Number,
        required : [true, "Please enter the amount of the product"]
    },
    category : {
        type : String,
        required : [true, "Please enter the product category"],
    },
    foodImage : {
        type : String,
        required : [true, "Please upload a product image"],
    }
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;