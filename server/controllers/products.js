const pool = require("../postgres-config");

const getProducts = async (request, response) => {
  try {
    const results = await pool.query("SELECT * FROM products ORDER BY id ASC");
    response.status(200).json(results.rows);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

const getProductById = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    response.status(200).json(product.rows);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

const createProduct = async (request, response) => {
  const { name, description, price, weight, image_url, stock_quantity } =
    request.body;
  const newName = name.trim();

  try {
    const insertResults = await pool.query(
      "INSERT INTO products (name, description, price, weight, image_url, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [newName, description, price, weight, image_url, stock_quantity]
    );
    response
      .status(201)
      .json({product: insertResults.rows[0]});
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

const updateProduct = async (request, response) => {
  const id = parseInt(request.params.id);
  const { name, description, price, weight, image_url, stock_quantity } =
    request.body;

  try {
    await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, weight = $4, image_url = $5, stock_quantity = $6 WHERE id = $7",
      [name, description, price, weight, image_url, stock_quantity, id]
    );
    const results = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    response.status(200).json({ product: results.rows[0] });
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (request, response) => {
  const id = parseInt(request.params.id);

  try {
    await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);
    response.status(200).send(`Product deleted with ID: ${id}`);
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
