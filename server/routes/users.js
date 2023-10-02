const express = require("express");
const router = express.Router();
const usersQueries = require("../controllers/users");
const { registerValidation, loginValidation } = require("../validators/auth");
const {
  validationMiddleware,
} = require("../middlewares/validation-middleware");
const { userAuth } = require("../middlewares/auth-middleware");

// Define user-related routes here
// router.get("/", usersQueries.getUsers);
// router.get("/:id", usersQueries.getUserById);
// router.post("/", usersQueries.createUser);
// router.put("/:id", usersQueries.updateUser);
// router.delete("/:id", usersQueries.deleteUser);

// If you want a protected endpoint, be sure to pass in userAuth as the second parameter
router.get("/protected", userAuth, usersQueries.protected);
router.get("/", usersQueries.getUsers);
router.post(
  "/register",
  registerValidation,
  validationMiddleware,
  usersQueries.register
);
router.post(
  "/login",
  loginValidation,
  validationMiddleware,
  usersQueries.login
);
router.get(
  "/logout",
  userAuth,
  usersQueries.logout
);

module.exports = router;
