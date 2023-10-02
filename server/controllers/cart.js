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
  // console.log(req.user.id);
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
        "SELECT * FROM cart_items WHERE cart_id = $1",
        [cartId]
      );
      // res.json(cartItems.rows);
      res.json({cart: cartItems.rows})


    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const addItem = async (req, res) => {
  const { cart_id, product_id, quantity } = req.body
  await pool.query(
    `INSERT INTO cart_items(cart_id, product_id, quantity)
         VALUES($1, $2, $3) ON CONFLICT (cart_id, product_id)
        DO UPDATE set quantity = cart_items.quantity + 1 returning *`,
    [cart_id, product_id, quantity]
  );

  const results = await pool.query(
    "Select products.*, cart_items.quantity, round((products.price * cart_items.quantity)::numeric, 2) as subtotal from cart_items join products on cart_items.id = products.id where cart_items.cart_id = $1",
    [cart_id]
  );

  return res.json({cart: results.rows});
};

module.exports = {
  getCarts,
  getAll,
  addItem
};
