const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");

const { generateToken } = require("../utils/generateToken");
const { use } = require("bcrypt/promises");
const { send } = require("process");

module.exports.registerUser = async function (req, res) {
  try {
    let { email, fullname, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (user) {
      req.flash("error", "You already have an account here, please login");
      res.redirect("/");
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          if (err) return res.send(err.message);
          else {
            let user = await userModel.create({
              email,
              password: hash,
              fullname,
            });
            let token = generateToken(user);
            res.cookie("token", token);
            res.redirect("/shop");
          }
        });
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};
module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });
  if (!user) return res.send("Email or Password incorrect");
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);
      res.redirect("/shop");
    } else {
      return res.send("Email or Password incorrect");
    }
  });
};

module.exports.logout = async function (req, res) {
  delete res.locals.loggedin;
  res.cookie("token", "");
  res.redirect("/");
};
