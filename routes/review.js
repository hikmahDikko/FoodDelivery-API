const express = require("express");
const reviewController = require("../controllers/review");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

const { createReview } = reviewController;

router.post("/:id", auth, createReview);

// router.get("/all", auth, checkUser("vendor"), getAllOrderedItems);

// router.route("/:id").get(auth, getOneHistory).delete(auth, deleteHistory);

module.exports = router;