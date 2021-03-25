const express = require("express");
const router = express.Router();
const { validateInputs } = require("../middleware/validator");
const { userValidationRules } = require("../lib/validation/userRules");

const auth = require('../middleware/auth');

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser,
  getLogin,
  userLogin,
} = require("../controllers/usersController");

router
  .route("/login")
  .get(getLogin)
  .post(userLogin);

router
  .route("/")
  .get(getUsers)
  .post(validateInputs(userValidationRules), addUser);

router
  .route("/:id")
  .get(getUser)
  .delete(auth, deleteUser)
  .put(updateUser);



module.exports = router;
