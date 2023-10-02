// const pool = require("../postgres-config");

// const getUsers = (request, response) => {
//   pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };

// const getUserById = (request, response) => {
//   const id = parseInt(request.params.id);

//   pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };

// // const createUser = (request, response) => {
// //   const { name, email } = request.body;
// //   let guest = true
// //   if (name && email) {
// //     guest = false
// //   }

// //     pool.query(
// //       "INSERT INTO users (name, email, is_guest) VALUES ($1, $2, $3) RETURNING *",
// //       [name, email, guest],
// //       (error, results) => {
// //         try {
// //           if (error) {
// //             throw error;
// //           }
// //           response.status(201).send(`User added with ID: ${results.rows[0].id}`);
// //         } catch (error) {
// //         console.error(error)
// //         response.status(400).send('Duplicate email, user was not created.');
// //       }
// //     }
// //     );
// //   }

// // const createUser = (request, response) => {
// //   const { name, email } = request.body;

// //   // Check if the email already exists
// //   pool.query(
// //     "SELECT COUNT(*) FROM users WHERE email = $1",
// //     [email],
// //     (selectError, selectResults) => {
// //       if (selectError) {
// //         console.error(selectError);
// //         response.status(500).send('Database error');
// //         return;
// //       }

// //       const userCount = selectResults.rows[0].count;

// //       if (userCount > 0) {
// //         // Duplicate email exists, handle the error
// //         response.status(400).send('Duplicate email, user was not created.');
// //       } else {
// //         // Email is unique, proceed with the INSERT operation
// //         let guest = true;
// //         if (name && email) {
// //           guest = false;
// //         }

// //         pool.query(
// //           "INSERT INTO users (name, email, is_guest) VALUES ($1, $2, $3) RETURNING *",
// //           [name, email, guest],
// //           (insertError, insertResults) => {
// //             if (insertError) {
// //               console.error(insertError);
// //               response.status(500).send('Error creating user');
// //             } else {
// //               response.status(201).send(`User added with ID: ${insertResults.rows[0].id}`);
// //             }
// //           }
// //         );
// //       }
// //     }
// //   );
// // };

// const createUser = async (req, res) => {
//   const { name, email } = req.body;
//   let guest = true;
//   if (name && email) {
//     guest = false;
//   }

//   const user = await pool.query(
//     "INSERT INTO users (name, email, is_guest) VALUES ($1, $2, $3) RETURNING *",
//     [name, email, guest]
//   );
//   const userId = user.rows[0].id;

//   // Create a cart for the user
//   await pool.query("INSERT INTO carts (user_id) VALUES ($1)", [userId]);

//   res.status(201).send(`User added with ID: ${userId}`);
// };

// const updateUser = (request, response) => {
//   const id = parseInt(request.params.id);
//   const { name, email } = request.body;

//   pool.query(
//     "UPDATE users SET name = $1, email = $2 WHERE id = $3",
//     [name, email, id],
//     (error, results) => {
//       if (error) {
//         throw error;
//       }
//       response.status(200).send(`User modified with ID: ${id}`);
//     }
//   );
// };

// const deleteUser = (request, response) => {
//   const id = parseInt(request.params.id);

//   pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).send(`User deleted with ID: ${id}`);
//   });
// };

// module.exports = {
//   getUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser,
// };

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
    const token = await sign(payload, SECRET)


    return res.status(200).cookie('token', token, {httpOnly: true}).json({success: true, message: "Log in successful"})
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
