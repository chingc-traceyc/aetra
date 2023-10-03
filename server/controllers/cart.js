const pool = require("../postgres-config");

const getAll = (request, response) => {
  try {
    pool.query("SELECT * FROM carts ORDER BY id ASC", (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  } catch (error) {
    response
      .status(500)
      .json({ error: "An error occurred while fetching carts." });
  }
};

const getCarts = async (req, res) => {
  const id = req.user.id;

  if (id) {
    try {
      // Get the cart associated with the user
      const cart = await pool.query("SELECT * FROM carts WHERE user_id = $1", [
        id,
      ]);
      const cartId = cart.rows[0].id;

      // Get the items in the cart
      const cartItems = await pool.query(
        "SELECT *, ROUND((p.price * c.quantity)::NUMERIC, 2) AS subtotal FROM cart_items c LEFT JOIN products p ON (c.product_id = p.id) WHERE cart_id = $1",
        [cartId]
      );
      res.json({ cart: cartItems.rows });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const addItem = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  if (userId) {
    try {
      const cart = await pool.query("SELECT * FROM carts WHERE user_id = $1", [
        userId,
      ]);
      const cartId = cart.rows[0].id;

      await pool.query(
        `INSERT INTO cart_items(cart_id, product_id, quantity)
        VALUES($1, $2, $3) ON CONFLICT (cart_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + $3 RETURNING *`,
        [cartId, product_id, quantity]
      );

      const results = await pool.query(
        "SELECT p.*, c.quantity, ROUND((p.price * c.quantity):: NUMERIC, 2) AS subtotal FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.cart_id = $1",
        [cartId]
      );

      return res.status(200).json({ cart: results.rows });
    } catch (error) {
      console.error(error.message);
      return res.json({ error: error.message });
    }
  }
};

const decreaseItem = async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  if (userId) {
    try {
      const cart = await pool.query("SELECT * FROM carts WHERE user_id = $1", [
        userId,
      ]);
      const cartId = cart.rows[0].id;

      await pool.query(
        "UPDATE cart_items SET quantity = quantity - 1 WHERE cart_items.cart_id = $1 AND cart_items.product_id = $2 RETURNING *",
        [cartId, product_id]
      );

      const results = await pool.query(
        "SELECT p.*, c.quantity, ROUND((p.price * c.quantity):: NUMERIC, 2) AS subtotal FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.cart_id = $1",
        [cartId]
      );

      return res.status(200).json({ cart: results.rows });
    } catch (error) {
      console.error(error);
      return res.json({ error: error.message });
    }
  }
};

const emptyCart = async (req, res) => {
  const cartId = parseInt(req.params.id);
  await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
  res.status(200).json({ message: "Cart emptied" });
};

module.exports = {
  getCarts,
  getAll,
  addItem,
  decreaseItem,
  emptyCart,
};
