const express = require("express");
const orderController = require("../controllers/order-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { getAllOrders, checkoutOrder} = orderController;

router.get("/", auth, getAllOrders);

router.post("/checkout", auth, checkoutOrder);

module.exports = router;