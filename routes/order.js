const express = require("express");
const orderController = require("../controllers/order");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

const { getAllOrders, checkOutOrder } = orderController;

router.get("/", auth, getAllOrders);

router.post("/checkout", auth, checkOutOrder);

module.exports = router;