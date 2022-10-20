const userController = require("../controllers/user-controller");
const express = require("express");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { getOne, getAll, deleteUser } = userController;

router.get("/", auth, checkUser("admin"), getAll);

router
    .route("/:id")
    .get(auth, getOne)
    .delete(auth, checkUser("admin"), deleteUser);

module.exports = router;
