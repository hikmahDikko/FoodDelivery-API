const express = require("express");
const orderController = require("../controllers/order-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { getAllOrders, checkoutOrder } = orderController;

router
    .route("/")
    .get(auth, checkUser("vendor"), getAllOrders);

router.post("/checkout", auth, checkoutOrder);

module.exports = router;