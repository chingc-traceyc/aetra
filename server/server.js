const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const usersRoutes = require("./routes/users");
const productsRoutes = require("./routes/products");
const cartRoutes = require("./routes/carts");

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.use("/users", usersRoutes); // Use the users router for user-related routes
app.use("/products", productsRoutes); // Use the products router for product-related routes
app.use("/carts", cartRoutes);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
