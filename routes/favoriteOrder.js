const express = require("express");
const favOrderController = require("../controllers/favoriteOrder");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { getAllFavOrders, checkoutFavOrder } = favOrderController;

router
    .route("/")
    .get(auth, getAllFavOrders);

router.post("/checkout", auth, checkoutFavOrder);

module.exports = router;
