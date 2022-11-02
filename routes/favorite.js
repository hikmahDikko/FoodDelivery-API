const express = require("express");
const favController = require("../controllers/favorite");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

const { createFavCart, getAllFavCarts, getOneFavCart, updateFavCart, deleteFavCart} = favController;

router
    .route("/:id")
    .patch(auth, updateFavCart)
    .get(auth, getOneFavCart)
    .delete(auth, deleteFavCart)
    

router
    .route("/")
    .post(auth, createFavCart)
    .get(auth, getAllFavCarts);

module.exports = router;
