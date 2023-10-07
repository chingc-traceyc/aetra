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
      // get the cart based on the users id
      const cart = await pool.query("SELECT * FROM carts WHERE user_id = $1", [
        userId,
      ]);
      const cartId = cart.rows[0].id;

      // decrease stock amount in the products table
      await pool.query(
        "UPDATE products SET stock_quantity = (stock_quantity - $1) WHERE id = $2",
        [quantity, product_id]
      );

      // insert or update product into the user's cart
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
      return res.status(200).json({ product: results.rows });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  }
};

const removeItem = async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  if (userId) {
    try {
      // Get user's cart id
      const cart = await pool.query("SELECT * FROM carts WHERE user_id = $1", [
        userId,
      ]);
      const cartId = cart.rows[0].id;

      // Retrieve items from the cart that are about to be removed
      const itemsInCart = await pool.query(
        "SELECT product_id, quantity FROM cart_items WHERE cart_id = $1 AND cart_items.product_id = $2",
        [cartId, product_id]
      );

      // Increment the stock quantity in the products table
      const { quantity } = itemsInCart.rows[0];
      await pool.query(
        "UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2",
        [quantity, product_id]
      );

      // Delete items from cart
      await pool.query(
        "DELETE FROM cart_items WHERE cart_id = $1 AND cart_items.product_id = $2",
        [cartId, product_id]
      );
      res.status(200).json({ message: "Product removed" });
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

      // Add qty back into the products table
      await pool.query(
        "UPDATE products SET stock_quantity = (stock_quantity + 1) WHERE id = $1",
        [product_id]
      );

      // update the users cart to decrease prod qty by 1
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
  const userId = req.user.id;

  if (userId) {
    try {
      // Get user's cart id
      const cart = await pool.query("SELECT * FROM carts WHERE user_id = $1", [
        userId,
      ]);
      const cartId = cart.rows[0].id;

      // Retrieve items from the cart that are about to be removed
      const itemsInCart = await pool.query(
        "SELECT product_id, quantity FROM cart_items WHERE cart_id = $1",
        [cartId]
      );

      // Increment the stock quantity for each item in the products table
      for (const item of itemsInCart.rows) {
        const { product_id, quantity } = item;
        await pool.query(
          "UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2",
          [quantity, product_id]
        );
      }

      // Delete items from cart
      await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
      res.status(200).json({ message: "Cart emptied" });
    } catch (error) {
      console.error(error.message);
      return res.json({ error: error.message });
    }
  }
};

const checkout = async (req, res) => {
  const userId = req.user.id;

  if (userId) {
    try {
      // Create new order id
      const order = await pool.query(
        "INSERT INTO orders(user_id) VALUES ($1) RETURNING *",
        [userId]
      );
      const orderId = order.rows[0].id;

      // Get user's cart id
      const cart = await pool.query("SELECT * FROM carts WHERE user_id = $1", [
        userId,
      ]);
      const cartId = cart.rows[0].id;

      // Retrieve items from the cart
      const itemsInCart = await pool.query(
        "SELECT product_id, quantity FROM cart_items WHERE cart_id = $1",
        [cartId]
      );

      // Add products to the order_items
      for (const item of itemsInCart.rows) {
        const { product_id, quantity } = item;
        await pool.query(
          "INSERT INTO orders_items(order_id, product_id, quantity) VALUES ($1, $2, $3)",
          [orderId, product_id, quantity]
        );
      }

      // Empty the items from cart
      await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

      // Return the order
      const results = await pool.query(
        "SELECT *, ROUND((p.price * o.quantity)::NUMERIC, 2) AS subtotal FROM orders_items o JOIN products p ON (o.product_id = p.id) WHERE order_id = $1",
        [orderId]
      );
      res.status(200).json({ order: results.rows });
    } catch (error) {
      console.error(error);
      return res.json({ error: error.message });
    }
  }
};

module.exports = {
  getCarts,
  getAll,
  addItem,
  removeItem,
  decreaseItem,
  emptyCart,
  checkout,
};
