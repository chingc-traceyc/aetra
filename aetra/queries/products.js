const pool = require("../postgres-config");

const createProductsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(250) UNIQUE,
        description TEXT,
        price NUMERIC,
        weight SMALLINT,
        image_url TEXT
      )
    `);
    console.log("Products table created (if it didn't exist).");
  } catch (error) {
    console.error("Error creating products table:", error);
  }
};

const getProducts = (request, response) => {
  pool.query("SELECT * FROM products ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getProductById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM products WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createProduct = (request, response) => {
  const { name, description, price, size } = request.body;

  pool.query(
    "INSERT INTO products (name, description, price, size) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, description, price, size],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Product added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateProduct = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, description, price, size } = request.body;

  pool.query(
    "UPDATE products SET name = $1, description = $2, price = $3, size = $4 WHERE id = $5",
    [name, description, price, size, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Product modified with ID: ${id}`);
    }
  );
};

const deleteProduct = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM products WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Product deleted with ID: ${id}`);
  });
};

module.exports = {
  createProductsTable,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
