const express = require("express");
const router = express.Router();
const cartsQueries = require("../controllers/cart");
const { userAuth } = require("../middlewares/auth-middleware");

// Define product-related routes here
router.get("/", userAuth, cartsQueries.getCarts);
router.post('/add', userAuth, cartsQueries.addItem);
router.get("/all", cartsQueries.getAll);
// router.get("/:id", productsQueries.getProductById);
// router.post("/", cartsQueries.createCart);
// router.put("/:id", productsQueries.updateProduct);
// router.delete("/:id", productsQueries.deleteProduct);

module.exports = router;
