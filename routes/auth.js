const authController = require("../controllers/auth");
const express = require("express");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

const { signIn, signUp, forgotPassword, resetPassword } = authController;


router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/forgot-password", forgotPassword)

router.patch("/reset-password/:token", resetPassword);

module.exports = router;
