const User = require("../models/UserModel");
const { createToken, handleErrors } = require("../utils/utils");
const bcrypt = require("bcrypt");

module.exports = {
  /* handles GET request to /login */
  showLoginPage: (req, res) => {
    res.render("login", { title: "Login" });
  },

  /* handles GET request to /register */
  showRegPage: (req, res) => {
    res.render("register", { title: "Register" });
  },

  /* handles POST request to /login */
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (user) {
        // compare password with the one in the DB
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          // log user in by creating a token and sending to browser via cookie
          const token = createToken(user._id);
          res.cookie("btoken", token, { maxAge: 86400000, httpOnly: true });
          res.status(200).json({ userId: user._id });
        } else {
          throw Error("invalid password");
        }
      } else {
        throw Error("invalid username");
      }
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  },

  /* handles POST request to /register */
  registerUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await User.create({ username, email, password });

      // create token and send to browser in via cookie
      const token = createToken(user._id);
      res.cookie("btoken", token, { maxAge: 86400000, httpOnly: true });
      res.status(201).json({ userId: user._id });

      console.log("new user registered");
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  },

  /* Handles GET request to /logout */
  logoutUser: (req, res) => {
    //  reset cookie
    res.cookie("btoken", "", { maxAge: 1, httpOnly: true });
    res.redirect("/");
  },
};
