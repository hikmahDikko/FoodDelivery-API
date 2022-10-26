const express = require("express");
const orderController = require("../controllers/order-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { getAllOrders, getOneOrder, checkoutOrder, deleteOrder } = orderController;

router
    .route("/")
    .get(auth, checkUser("vendor"), getAllOrders);

router.post("/checkout", auth, checkoutOrder);

router.route("/:id").get(auth, checkUser("vendor"), getOneOrder).delete(auth, checkUser("vendor"), deleteOrder);

module.exports = router;