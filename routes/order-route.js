const express = require("express");
const orderController = require("../controllers/order-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { getOrders, checkoutOrder } = orderController;

router
    .route("/")
    .get(auth, getOrders);

router.post("/checkout", auth, checkoutOrder);

module.exports = router;
