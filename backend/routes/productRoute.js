const express = require("express");
const {isAuthenticated, authorizeRoles} = require("../middleware/auth")
const {
  getAllproducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
} = require("../controllers/productController");

const router = express.Router();

router.route("/products").get(getAllproducts);

router.route("/product/new").post(isAuthenticated,authorizeRoles("admin"),createProduct);

router
  .route("/product/:id")
  .put(isAuthenticated,authorizeRoles("admin"),updateProduct)
  .delete(isAuthenticated,authorizeRoles("admin"),deleteProduct)
  .get(getProductDetail);

module.exports = router;
