const express = require("express");

const {getAllproducts, createProduct} = require("../controllers/productController")

const router = express.Router();

router.route("/products").get(getAllproducts)

router.route("/product/new").post(createProduct)

module.exports = router;