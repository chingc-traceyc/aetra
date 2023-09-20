const pool = require("../postgres-config");

const createCartTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS cart (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id)
        )
      `);
      console.log("Cart table created (if it didn't exist).");
    } catch (error) {
      console.error("Error creating cart table:", error);
    }
  };

const getCart = async () => {

}

module.exports = {
    createCartTable
}
