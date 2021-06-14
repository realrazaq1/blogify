const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/UserModel");

const { TOKEN_SECRET } = process.env;

class Utils {
  // connect to database
  static connectToDB = async (cb) => {
    try {
      await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      console.log("connected to mongoDB...");
      cb ? cb() : null;
    } catch (err) {
      console.log(err);
    }
  };

  //create token
  static createToken = (id) => {
    return jwt.sign({ id }, TOKEN_SECRET, { expiresIn: 86400 });
  };

  // handle errors
  static handleErrors = (err) => {
    const errors = {
      username: "",
      email: "",
      password: "",
      title: "",
      email: "",
      password: "",
    };

    // username error
    if (err.message == "invalid username") {
      errors.username = err.message;
    }
    // email error
    if (err.message == "invalid password") {
      errors.password = err.message;
    }

    // user validation errors
    if (err.message.includes("User validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
    // blog validation errors
    if (err.message.includes("Blog validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }

    // duplicate error
    if (err.code == 11000) {
      Object.values(err).forEach((val) => {
        if (Object.keys(val) == "username") {
          errors.username = "username already exist";
        }
        if (Object.keys(val) == "email") {
          errors.email = "email address already exist";
        }
      });
    }

    return errors;
  };

  // authenticate users trying to visit protected routes
  static requireAuth = (req, res, next) => {
    const token = req.cookies.btoken;
    if (token) {
      // verify token & open protected route
      jwt.verify(token, TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
          console.log(err);
        } else {
          next();
        }
      });
    } else {
      res.redirect("/login");
    }
  };

  // check currently logged in user
  static checkCurrentUser = (req, res, next) => {
    const token = req.cookies.btoken;
    if (token) {
      // verify token & open protected route
      jwt.verify(token, TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err);
        } else {
          //  grab user info from db and send to the views
          const user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };

  // hide login and registration page from logged in users
  static hideAuthRoutes = (req, res, next) => {
    const token = req.cookies.btoken;
    if (token) {
      // verify token & open protected route
      jwt.verify(token, TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err);
        } else {
          //  redirect to dashboard
          res.redirect("/dashboard");
        }
      });
    } else {
      next();
    }
  };
}

module.exports = Utils;
