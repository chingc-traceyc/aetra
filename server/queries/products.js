const pool = require("../postgres-config");

// const getProducts = (request, response) => {
//   pool.query("SELECT * FROM products ORDER BY id ASC", (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };

const getProducts = (request, response) => {
  try {
    pool.query("SELECT * FROM products ORDER BY id ASC", (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  } catch (error) {
    response
      .status(500)
      .json({ error: "An error occurred while fetching products." });
  }
};

// const getProductById = (request, response) => {
//   const id = parseInt(request.params.id);

//   pool.query("SELECT * FROM products WHERE id = $1", [id], (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };

const getProductById = (request, response) => {
  const id = parseInt(request.params.id);

  try {
    pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
  } catch (error) {
    response
      .status(500)
      .json({ error: "An error occurred while fetching the product by ID." });
  }
};

// const createProduct = (request, response) => {
//   const { name, description, price, size } = request.body;

//   pool.query(
//     "INSERT INTO products (name, description, price, size) VALUES ($1, $2, $3, $4) RETURNING *",
//     [name, description, price, size],
//     (error, results) => {
//       if (error) {
//         throw error;
//       }
//       response.status(201).send(`Product added with ID: ${results.rows[0].id}`);
//     }
//   );
// };

const createProduct = async (request, response) => {
  const { name, description, price, weight, image_url, stock_quantity } =
    request.body;

  try {
    // Check for duplicate product name before inserting
    const selectResults = await pool.query(
      "SELECT * FROM products WHERE name = $1",
      [name]
    );

    if (selectResults.rows.length > 0) {
      response
        .status(400)
        .json({ error: "A product with the same name already exists." });
    } else {
      // If no duplicate exists, insert the product
      const insertResults = await pool.query(
        "INSERT INTO products (name, description, price, weight, image_url, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [name, description, price, weight, image_url, stock_quantity]
      );
      response
        .status(201)
        .send(`Product added with ID: ${insertResults.rows[0].id}`);
    }
  } catch (error) {
    response
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};

// const updateProduct = (request, response) => {
//   const id = parseInt(request.params.id);
//   const { name, description, price, weight, image_url, stock_quantity } = request.body;

//   pool.query(
//     "UPDATE products SET name = $1, description = $2, price = $3, weight = $4 image_url = $5 stock_quantity = $6 WHERE id = $7",
//     [name, description, price, weight, image_url, stock_quantity, id],
//     (error, results) => {
//       if (error) {
//         throw error;
//       }
//       response.status(200).send(`Product modified with ID: ${id}`);
//     }
//   );
// };

const updateProduct = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, description, price, weight, image_url, stock_quantity } =
    request.body;

  try {
    pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, weight = $4, image_url = $5, stock_quantity = $6 WHERE id = $7",
      [name, description, price, weight, image_url, stock_quantity, id],
      (error, results) => {
        response.status(200).send(`Product modified for ID ${id}`);
      }
    );
  } catch (error) {
    response
      .status(500)
      .json({ error: `An error occurred while updating the product with ID ${id}.` });
  }
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
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
