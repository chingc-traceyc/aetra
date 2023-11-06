const pool = require("../postgres-config");

const getAllOrders = async (request, response) => {
  try {
    results = await pool.query("SELECT * FROM orders ORDER BY id ASC");

    response.status(200).json({ orders: results.rows });
  } catch (error) {
    response
      .status(500)
      .json({ error: "An error occurred while fetching orders." });
  }
};

const getUserOrders = async (req, res) => {
  const id = req.user.id;

  if (id) {
    try {
      // Get the orders associated with the user
      const orders = await pool.query(
        "SELECT * FROM orders WHERE user_id = $1",
        [id]
      );

      // //   Get the items in the order
      //   const orderItems = await pool.query(
      //     "SELECT *, ROUND((p.price * c.quantity)::NUMERIC, 2) AS amount FROM orders_items o LEFT JOIN products p ON (o.product_id = p.id) WHERE order_id = $1",
      //     [orderId]
      //   );
      res.json({ order: orders.rows });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const getOrder = async (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.user.id

  if (orderId) {
    try {
      // Get the order items associate with the order id
      const orderItems = await pool.query(
        "SELECT o.*, p.name, p.price, ROUND((p.price * o.quantity)::NUMERIC, 2) AS total FROM orders_items o JOIN products p ON (o.product_id = p.id) WHERE order_id = $1 AND user_id = $2",
        [orderId, userId]
      );

      res.json({ order: orderItems.rows });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  getAllOrders,
  getOrder,
  getUserOrders,
};
