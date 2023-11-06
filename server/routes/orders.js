const express = require("express");
const router = express.Router();
const ordersQueries = require("../controllers/orders");
const { userAuth } = require("../middlewares/auth-middleware");

// Define order-related routes here
router.get("/", userAuth, ordersQueries.getUserOrders);
router.get("/all", ordersQueries.getAllOrders);
router.get("/:id", userAuth, ordersQueries.getOrder);

module.exports = router;
