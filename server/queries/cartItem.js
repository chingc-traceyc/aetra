const pool = require("../postgres-config");

const createCartItem = (request, response) => {
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
