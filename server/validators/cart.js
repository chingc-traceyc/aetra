// const { check } = require("express-validator");
// const pool = require("../postgres-config");

// // Check if the cart is empty
// const cartIsEmptyCheck = check("cart_id").custom(async (value, req) => {
//   const id = req.user.id;
//   console.log("USER ID", id);
//   const cart = await pool.query("SELECT * FROM carts WHERE user_id = $1", [id]);
//   const cartId = cart.rows[0].id;

//   const cartItems = await pool.query(
//     "SELECT * FROM cart_items WHERE cart_id = $1",
//     [cartId]
//   );

//   if (cartItems.rows.length === 0) {
//     throw new Error("Cart is empty");
//   }
// });

// module.exports = {
//   cartIsEmptyCheck,
// };
