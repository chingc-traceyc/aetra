const express = require("express");
const router = express.Router();
const cartsQueries = require("../controllers/cart");
const { userAuth } = require("../middlewares/auth-middleware");
const {
  validationMiddleware,
} = require("../middlewares/validation-middleware");
const { productExistsCheckAndHasStock } = require("../validators/products");
const { cartIsEmptyCheck, validateAuth } = require("../validators/cart");

// Define cart-related routes here
router.get("/", userAuth, cartsQueries.getCarts);
router.get("/all", cartsQueries.getAll);
router.post(
  "/add",
  userAuth,
  productExistsCheckAndHasStock,
  validationMiddleware,
  cartsQueries.addItem
);
router.put("/decrease", userAuth, cartsQueries.decreaseItem);
router.put("/remove", userAuth, cartsQueries.removeItem);
router.delete("/", userAuth, cartsQueries.emptyCart);
router.post(
  "/checkout",
  userAuth,
  validateAuth,
  cartIsEmptyCheck,
  validationMiddleware,
  cartsQueries.checkout
);

module.exports = router;
