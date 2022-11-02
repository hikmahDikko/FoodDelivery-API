const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({path : "./config.env"});
//const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const foodRoutes = require("./routes/food");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const favCartRoutes = require("./routes/favorite");
const favOrderRoutes = require("./routes/favoriteOrder");
const orderHistory = require("./routes/order-history.js");
const review = require("./routes/review");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());

app.use(cookieParser());

var accessLogStream = fs.createWriteStream(path.join("utils", 'access.log'), {
    flags : 'a'
});

app.use(morgan('dev', { stream : accessLogStream }));

app.use("/api/v1/auths", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/foods", foodRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/favorites", favCartRoutes);
app.use("/api/v1/favorite-orders", favOrderRoutes);
app.use("/api/v1/order-histories", orderHistory);
app.use("/api/v1/reviews", review);

module.exports = app;