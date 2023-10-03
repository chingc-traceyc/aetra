const express = require("express");
const router = express.Router();
const cartsQueries = require("../controllers/cart");
const { userAuth } = require("../middlewares/auth-middleware");

// Define product-related routes here
router.get("/", userAuth, cartsQueries.getCarts);
router.get("/all", cartsQueries.getAll);
router.post('/add', userAuth, cartsQueries.addItem);
router.put('/decrease', userAuth, cartsQueries.decreaseItem);
router.delete("/", userAuth, cartsQueries.emptyCart);

module.exports = router;
