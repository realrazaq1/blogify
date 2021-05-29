const express = require("express");
const cookieParser = require("cookie-parser");
const AuthRoutes = require("./routes/AuthRoutes");
const BlogRoutes = require("./routes/BlogRoutes");
const { connectToDB, requireAuth, checkCurrentUser } = require("./utils/utils");

// setup express app
const app = express();

const PORT = process.env.PORT || 3000;

// setup view engine
app.set("view engine", "ejs");

// middleware & static folder
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// connect to DB
connectToDB();

// routes
app.use("*", checkCurrentUser);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard");
});

app.use(AuthRoutes);
app.use(BlogRoutes);

// listen for request
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
