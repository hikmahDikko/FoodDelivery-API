const express = require("express");
const orderHistoryController = require("../controllers/order-history");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { getAllHistories, getUserHistory, getOneHistory, getAllOrderedItems, deleteHistory} = orderHistoryController;

router.get("/", auth, getAllHistories);

router.get("/all", auth, checkUser("admin"), getAllOrderedItems);

router.get("/one/:id", auth, checkUser("admin"), getUserHistory);

router.route("/:id").get(auth, getOneHistory).delete(auth, deleteHistory);

module.exports = router;