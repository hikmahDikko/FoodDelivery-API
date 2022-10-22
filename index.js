const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({path : "./config.env"});
//const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const authRoutes = require("./routes/auth-route");
const userRoutes = require("./routes/user-route");
const foodRoutes = require("./routes/food-route");
const cartRoutes = require("./routes/cart-route");
const orderRoutes = require("./routes/order-route");
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

module.exports = app;