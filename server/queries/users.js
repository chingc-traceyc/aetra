const pool = require("../postgres-config");

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    try {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    } catch {
      console.error(error)
      response.status(401).send('Unauthorized')
    }
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    try {
      if (error) {
        throw error;
      }

      if (results.rows.length === 0) {
        // User not found
        response.status(404).send('User not found');
      } else {
        // User found, return user data
        response.status(200).json(results.rows);
      }
    } catch (error) {
      console.error(error);
      response.status(500).send('Internal server error');
    }
  });
};

// const createUser = (request, response) => {
//   const { name, email } = request.body;
//   let guest = true
//   if (name && email) {
//     guest = false
//   }

//     pool.query(
//       "INSERT INTO users (name, email, is_guest) VALUES ($1, $2, $3) RETURNING *",
//       [name, email, guest],
//       (error, results) => {
//         try {
//           if (error) {
//             throw error;
//           }
//           response.status(201).send(`User added with ID: ${results.rows[0].id}`);
//         } catch (error) {
//         console.error(error)
//         response.status(400).send('Duplicate email, user was not created.');
//       }
//     }
//     );
//   }

const createUser = (request, response) => {
  const { name, email } = request.body;

  // Check if the email already exists
  pool.query(
    "SELECT COUNT(*) FROM users WHERE email = $1",
    [email],
    (selectError, selectResults) => {
      if (selectError) {
        console.error(selectError);
        response.status(500).send('Database error');
        return;
      }

      const userCount = selectResults.rows[0].count;

      if (userCount > 0) {
        // Duplicate email exists, handle the error
        response.status(400).send('Duplicate email, user was not created.');
      } else {
        // Email is unique, proceed with the INSERT operation
        let guest = true;
        if (name && email) {
          guest = false;
        }

        pool.query(
          "INSERT INTO users (name, email, is_guest) VALUES ($1, $2, $3) RETURNING *",
          [name, email, guest],
          (insertError, insertResults) => {
            if (insertError) {
              console.error(insertError);
              response.status(500).send('Error creating user');
            } else {
              response.status(201).send(`User added with ID: ${insertResults.rows[0].id}`);
            }
          }
        );
      }
    }
  );
};


const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
