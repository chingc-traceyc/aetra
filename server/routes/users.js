const express = require("express");
const router = express.Router();
const usersQueries = require("../queries/users");

// Define user-related routes here
router.get("/", usersQueries.getUsers);
router.get("/:id", usersQueries.getUserById);
router.post("/", usersQueries.createUser);
router.put("/:id", usersQueries.updateUser);
router.delete("/:id", usersQueries.deleteUser);

module.exports = router;
