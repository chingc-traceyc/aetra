const pool = require("../postgres-config");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants")

const protected = async (req, res) => {
  try {
    return res.status(200).json({ info: "protected info" });
  } catch (error) {
    console.log(error.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, name, email, is_guest FROM users");
    return res.status(200).json({ success: true, users: rows });
  } catch (error) {
    console.log(error.message);
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  let guest = true;
  try {
    if (name && email) {
      guest = false;
    }
    const hashedPassword = await hash(password, 10);

    const user = await pool.query(
      "INSERT INTO users (name, email, password, is_guest) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, guest]
    );
    const userId = user.rows[0].id;

    await pool.query("INSERT INTO carts (user_id) VALUES ($1)", [userId]);

    return res
      .status(201)
      .json({ success: true, message: "The registration was successful" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  let user = req.user;
  let payload = { id: user.id, email: user.email };
  try {
    const token = await sign(payload, SECRET, { expiresIn: "1h" });

    return res.status(200).cookie('token', token, {httpOnly: true}).json({success: true, message: "Log in successful", id: payload.id})
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token", { httpOnly: true })
      .json({ success: true, message: "Log out successful" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
module.exports = {
  getUsers,
  register,
  login,
  protected,
  logout
};
