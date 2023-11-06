const pool = require("../postgres-config");

const checkOrderExists = async (req, res, next) => {
  const orderId = parseInt(req.params.id);

  const order = await pool.query("SELECT * FROM orders WHERE id = $1", [
    orderId,
  ]);

  if (order.rows.length === 0) {
    res
      .status(404)
      .json({ message: `Order with ID ${orderId} does not exist` });
  } else {
    next();
  }
};

const checkUserAuthorization = async (req, res, next) => {
  const orderId = parseInt(req.params.id);
  const userId = req.user.id;

  // Perform the user authorization check here (e.g., compare userId with the order owner's user_id in the database)
  const order = await pool.query("SELECT user_id FROM orders WHERE id = $1", [
    orderId,
  ]);
  if (order.rows.length === 0 || order.rows[0].user_id !== userId) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    // If the user is authorized, continue to the next middleware or the main function
    next();
  }
};

module.exports = {
  checkOrderExists,
  checkUserAuthorization,
};
