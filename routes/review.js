const express = require("express");
const reviewController = require("../controllers/review");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

const { createReview, getAllReviews, getOneReview, deleteOneReview, updateReview } = reviewController;

router.post("/:id", auth, createReview);

router.get("/", auth, getAllReviews);

router.route("/:id").get(auth, getOneReview).delete(auth, deleteOneReview).patch(auth, updateReview);

module.exports = router;