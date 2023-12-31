const { check } = require("express-validator");
const pool = require("../postgres-config");

//check if product exists
const productExistsCheck = check("name").custom(
  async (value) => {
    const name = value.trim()
    const product = await pool.query("SELECT * from products WHERE name = $1", [
      name,
    ]);
    if (product.rows.length) {
      throw new Error("Product already exists");
    }
  }
);

//check if product doesnt exist
const productDoesntExistCheck = check("id").custom(
  async (value) => {
    const product = await pool.query("SELECT * from products WHERE id = $1", [
      value,
    ]);
    if (!product.rows.length) {
      throw new Error("Product does not exist");
    }
  }
);

//check if product exists and has enough stock
const productExistsCheckAndHasStock = check("product_id").custom(
  async (value, { req }) => {
    const { quantity } = req.body;

    const product = await pool.query("SELECT * from products WHERE id = $1", [
      value,
    ]);
    if (!product.rows.length) {
      throw new Error("Product does not exist");
    }

    const stockAvailable = await pool.query(
      "SELECT stock_quantity from products WHERE id = $1",
      [value]
    );

    if (stockAvailable.rows.length === 0) {
      throw new Error("No stock available for that product.");
    }

    if (stockAvailable.rows[0].stock_quantity < quantity) {
      throw new Error("Not enough stock available for this product.");
    }
  }
);

module.exports = {
  productExistsCheckAndHasStock,
  productExistsCheck,
  productDoesntExistCheck,
};
