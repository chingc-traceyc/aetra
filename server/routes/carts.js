const express = require("express");
const router = express.Router();
const cartsQueries = require("../controllers/cart");

// Define product-related routes here
router.get("/", cartsQueries.getAll);
// router.get("/:id", productsQueries.getProductById);
// router.post("/", cartsQueries.createCart);
// router.put("/:id", productsQueries.updateProduct);
// router.delete("/:id", productsQueries.deleteProduct);

module.exports = router;
