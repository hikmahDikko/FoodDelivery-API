const express = require("express");
const cartController = require("../controllers/cart-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { createCart, getAllCarts, getOneCart, updateCart, deleteCart} = cartController;

router
    .route("/:id")
    .patch(auth, updateCart)
    .get(auth, getOneCart)
    .delete(auth, deleteCart)
    

router
    .route("/")
    .post(auth, createCart)
    .get(auth, getAllCarts);

module.exports = router;
