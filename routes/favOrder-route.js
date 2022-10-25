const express = require("express");
const favOrderController = require("../controllers/FavOrder-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { getFavOrders, checkoutFavOrder, deleteFavOrder } = favOrderController;

router
    .route("/")
    .get(auth, checkUser("vendor"), getFavOrders);

router.post("/checkout", auth, checkoutFavOrder);

router.delete("/:id", auth, deleteFavOrder);

module.exports = router;