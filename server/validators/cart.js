const { check, validationResult } = require("express-validator");
const pool = require("../postgres-config");
const { SECRET } = require("../constants");
const jwt = require("jsonwebtoken");

// Define validation rules
const validateAuth = [
  check("Authorization")
    .notEmpty()
    .withMessage("Token is missing")
    .matches(/^Bearer .+/)
    .withMessage("Invalid token format"),
];

// Check if the cart is empty
const cartIsEmptyCheck = async (req, res, next) => {
  // Execute validation rules and check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Validation passed, continue with the cart check

  // Access the token from the request headers
  const authHeader = req.headers["authorization"];

  // Extract the token from the "Bearer" prefix
  const token = authHeader.split(" ")[1];

  // Verify and decode the token to access user information
  const decodedToken = jwt.verify(token, SECRET);

  // Extract the user ID from the decoded token
  const userId = decodedToken.id;

  // Use the user ID in database queries
  const cart = await pool.query("SELECT * FROM carts WHERE user_id = $1", [
    userId,
  ]);
  const cartId = cart.rows[0].id;

  const cartItems = await pool.query(
    "SELECT * FROM cart_items WHERE cart_id = $1",
    [cartId]
  );

  if (cartItems.rows.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  next();
};

module.exports = {
  cartIsEmptyCheck,
  validateAuth,
};
