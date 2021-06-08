const express = require("express");
const cookieParser = require("cookie-parser");
const AuthRoutes = require("./routes/AuthRoutes");
const BlogRoutes = require("./routes/BlogRoutes");
const DefaultRoutes = require("./routes/DefaultRoutes");
const { connectToDB, checkCurrentUser } = require("./utils/utils");

// setup express app
const app = express();

const PORT = process.env.PORT || 98;

// setup view engine
app.set("view engine", "ejs");

// middleware & static folder
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// connect to DB
connectToDB(() => {
  // listen for request
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
});

// routes
app.use("*", checkCurrentUser);
app.use(DefaultRoutes);
app.use(AuthRoutes);
app.use(BlogRoutes);

// 404
app.use((req, res) => {
  res.send("404 | Not Found");
});
