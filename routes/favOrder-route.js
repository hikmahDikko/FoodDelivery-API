const express = require("express");
const favOrderController = require("../controllers/FavOrder-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { getAllFavOrders, getOneFavOrder, checkoutFavOrder, deleteFavOrder } = favOrderController;

router
    .route("/")
    .get(auth, checkUser("vendor"), getAllFavOrders);

router.post("/checkout", auth, checkoutFavOrder);

router.route("/:id").get(auth, checkUser("vendor"), getOneFavOrder).delete(auth, checkUser("vendor"), deleteFavOrder);

module.exports = router;
