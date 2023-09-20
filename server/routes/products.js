const express = require("express");
const router = express.Router();
const productsQueries = require("../queries/products");

// Define product-related routes here
router.get("/", productsQueries.getProducts);
router.get("/:id", productsQueries.getProductById);
router.post("/", productsQueries.createProduct);
router.put("/:id", productsQueries.updateProduct);
router.delete("/:id", productsQueries.deleteProduct);

module.exports = router;
