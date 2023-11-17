const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { PORT, CLIENT_URL } = require("./constants");
const passport = require("passport");
const usersRoutes = require("./routes/users");
const productsRoutes = require("./routes/products");
const cartRoutes = require("./routes/carts");
const orderRoutes = require("./routes/orders");
const app = express();

// Import passport middleware
require('./middlewares/passport-middlewares');

// Initialize middlewares
app.use(express.json());
allowedOrigins = [
  "http://localhost:3001",
  CLIENT_URL,
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(cookieParser());
app.use(passport.initialize())

// Import routes
app.use("/users", usersRoutes); // Use the users router for user-related routes
app.use("/products", productsRoutes); // Use the products router for product-related routes
app.use("/carts", cartRoutes); // Use the carts router for cart-related routes
app.use("/orders", orderRoutes); // Use the carts router for order-related routes

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
