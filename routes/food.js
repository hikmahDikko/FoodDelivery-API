const express = require("express");
const foodController = require("../controllers/food");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { uploadFoodImage, resizeImage, uploadFood, getOneFood, updateFood, deleteFood, getAllFoods } =   foodController;

router
    .route("/:id")
    .get(auth, getOneFood)
    .patch(auth, checkUser("vendor"), uploadFoodImage, resizeImage, updateFood)
    .delete(auth, checkUser("vendor", "admin"), deleteFood)

router.route("/").get(auth, getAllFoods).post(auth, checkUser("vendor"), uploadFoodImage, resizeImage, uploadFood);

module.exports = router;
