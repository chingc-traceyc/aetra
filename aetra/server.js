const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;
const products = require("./queries/products")
const users = require("./queries/users");
const cart = require("./queries/cart");
const usersRoutes = require("./routes/users");
const productsRoutes = require("./routes/products");

app.use(express.json());
app.use(cors());

products.createProductsTable();
users.createUsersTable();
cart.createCartTable();

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.use("/users", usersRoutes); // Use the users router for user-related routes
app.use("/products", productsRoutes); // Use the products router for product-related routes

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
