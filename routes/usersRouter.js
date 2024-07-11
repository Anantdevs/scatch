const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
} = require("../controllers/authController");

// require("dotenv").config();

router.get("/", function (req, res) {
  res.send("hey it's working");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);

module.exports = router;
