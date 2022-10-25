const express = require("express");
const orderController = require("../controllers/order-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { getOrders, checkoutOrder, deleteOrder } = orderController;

router
    .route("/")
    .get(auth, checkUser("vendor"), getOrders);

router.post("/checkout", auth, checkoutOrder);

router.delete("/:id", auth, deleteOrder);

module.exports = router;
