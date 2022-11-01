const express = require("express");
const orderHistoryController = require("../controllers/order-history");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { getAllHistories, getOneHistory, getAllOrderedItems, deleteHistory} = orderHistoryController;

router.get("/", auth, getAllHistories);

router.get("/all", auth, checkUser("vendor"), getAllOrderedItems);

router.route("/:id").get(auth, getOneHistory).delete(auth, deleteHistory);

module.exports = router;