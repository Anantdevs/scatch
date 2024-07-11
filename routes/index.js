const express = require("express");
const isLoggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const router = express.Router();

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedin, async function (req, res) {
  let products = await productModel.find();
  let success = req.flash("success");
  res.render("shop", { products, success });
});

router.get("/cart", isLoggedin, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");
  // console.log(user.cart);
  res.render("cart", { user });
  // console.log(user.cart);
});

router.get("/addtocart/:productid", isLoggedin, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  user.save();
  req.flash("success", "Added to cart");
  res.redirect("/shop");
});

router.get("/logout", isLoggedin, function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
});

module.exports = router;
