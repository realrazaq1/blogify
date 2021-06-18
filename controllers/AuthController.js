const User = require("../models/UserModel");
const Utils = require("../utils/utils");
const bcrypt = require("bcrypt");

class AuthController {
  /**
   * GET request to /login.
   * Responsible for displaying the login page.
   */
  static showLoginPage = (req, res) => {
    res.render("login", { title: "Login", cssfile: "login" });
  };

  /**
   * GET request to /register.
   * Responsible for displaying the registeration page.
   */
  static showRegPage = (req, res) => {
    res.render("register", { title: "Register", cssfile: "register" });
  };

  /**
   * POST request to /login.
   * Handles all the logic responsible for logging a user in to their account.
   */
  static loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (user) {
        // compare password with the one in the DB
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          // log user in by creating a token and sending to browser via cookie
          const token = Utils.createToken(user._id);
          res.cookie("btoken", token, { maxAge: 86400000, httpOnly: true });
          res.status(200).json({ userId: user._id });
        } else {
          throw Error("invalid password");
        }
      } else {
        throw Error("invalid username");
      }
    } catch (err) {
      const errors = Utils.handleErrors(err);
      res.status(400).json({ errors });
    }
  };

  /**
   * POST request to /register.
   * Handles all the logic responsible for registering a new user.
   */
  static registerUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await User.create({ username, email, password });

      // create token and send to browser via cookie
      const token = Utils.createToken(user._id);
      res.cookie("btoken", token, { maxAge: 86400000, httpOnly: true });
      res.status(201).json({ userId: user._id });

      console.log("new user registered");
    } catch (err) {
      const errors = Utils.handleErrors(err);
      res.status(400).json({ errors });
    }
  };

  /**
   * GET request to /logout.
   * Handles the logic for logging a user out of their account.
   */
  static logoutUser = (req, res) => {
    //  reset cookie
    res.cookie("btoken", "", { maxAge: 1, httpOnly: true });
    res.redirect("/");
  };
}

module.exports = AuthController;
