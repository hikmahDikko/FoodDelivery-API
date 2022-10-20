const express = require("express");
const productController = require("../controllers/product-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { uploadProductImage, resizeImage, uploadProduct, getOneProduct, updateProduct, deleteProduct, getAllProducts } =   productController;

router
    .route("/:id")
    .get(auth, getOneProduct)
    .patch(auth, checkUser("vendor"), updateProduct)
    .delete(auth, checkUser("vendor", "admin"), deleteProduct)

router.route("/").get(auth, getAllProducts).post(auth, checkUser("vendor"), uploadProductImage, resizeImage, uploadProduct);

module.exports = router;
