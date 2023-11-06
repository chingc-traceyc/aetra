const express = require("express");
const router = express.Router();
const ordersQueries = require("../controllers/orders");
const { userAuth } = require("../middlewares/auth-middleware");
const {
  checkOrderExists,
  checkUserAuthorization,
} = require("../validators/order");

// Define order-related routes here
router.get("/", userAuth, ordersQueries.getUserOrders);
router.get("/all", ordersQueries.getAllOrders);
router.get(
  "/:id",
  userAuth,
  checkOrderExists,
  checkUserAuthorization,
  ordersQueries.getOrder
);

module.exports = router;
