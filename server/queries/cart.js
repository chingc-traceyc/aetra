const pool = require("../postgres-config");

const getCarts = async (req, res) => {
  const guestUserId = req.cookies.guestUserId;

  if (guestUserId) {
    try {
      const cart = await pool.query("SELECT * FROM carts WHERE user_id = $1", [
        guestUserId,
      ]);
      const cartId = cart.rows[0].id;
      const cartItems = await pool.query(
        "SELECT * FROM cart_items WHERE cart_id = $1",
        [cartId]
      );
      res.json(cartItems.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};


const createCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const guestUserId = req.cookies.guestUserId;

  if (guestUserId) {
    try {
      const cart = await pool.query("SELECT * FROM carts WHERE user_id = $1", [
        guestUserId,
      ]);
      const cartId = cart.rows[0].id;
      const newItem = await pool.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
        [cartId, productId, quantity]
      );
      res.json(newItem.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
    createCart,
    getCarts,
}
