const userController = require("../controllers/user");
const express = require("express");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { getOneUser, getAllUsers, deleteUser, updateUser } = userController;

router.get("/", auth, checkUser("admin"), getAllUsers);

router
    .route("/:id")
    .get(auth, getOneUser)
    .patch(auth, updateUser)
    .delete(auth, checkUser("admin"), deleteUser);

module.exports = router;
