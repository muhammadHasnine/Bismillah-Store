const express = require("express");

const {getAllproducts} = require("../controllers/productController")

const router = express.Router();

router.route("/products").get(getAllproducts)

module.exports = router;