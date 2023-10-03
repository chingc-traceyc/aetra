const express = require("express");
const router = express.Router();
const productsQueries = require("../controllers/products");
const {
  productExistsCheck,
  productDoesntExistCheck,
} = require("../validators/products");
const {
  validationMiddleware,
} = require("../middlewares/validation-middleware");

// Define product-related routes here
router.get("/", productsQueries.getProducts);
router.get(
  "/:id",
  productDoesntExistCheck,
  validationMiddleware,
  productsQueries.getProductById
);
router.post(
  "/",
  productExistsCheck,
  validationMiddleware,
  productsQueries.createProduct
);
router.put(
  "/:id",
  productDoesntExistCheck,
  validationMiddleware,
  productsQueries.updateProduct
);
router.delete(
  "/:id",
  productDoesntExistCheck,
  validationMiddleware,
  productsQueries.deleteProduct
);

module.exports = router;
