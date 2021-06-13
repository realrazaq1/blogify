const multer = require("multer");
const path = require("path");
const User = require("../models/UserModel");
const fs = require("fs");
const appDir = path.dirname(require.main.filename);

// configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const maxSize = 3 * 1000 * 1000;
const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    if (
      path.extname(file.originalname).toLowerCase() == ".jpg" ||
      path.extname(file.originalname).toLowerCase() == ".jpeg" ||
      path.extname(file.originalname).toLowerCase() == ".png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("wrong file format"), false);
    }
  },
}).single("file");

module.exports = {
  showHomePage: (req, res) => {
    res.render("index", {
      title: "Blogify | create awesome blogs",
      cssfile: "index",
    });
  },

  showDashboard: (req, res) => {
    res.render("dashboard", { title: "Dashboard", cssfile: "dashboard" });
  },

  showProfile: (req, res) => {
    const { user } = req.params;
    res.render("profile", { title: "Profile", cssfile: "profile", name: user });
  },
  uploadPP: (req, res) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // multer error
        console.log(err.message);
        res.status(400).json({ message: err.message });
      } else if (err) {
        // our own custom error will be handled here
        console.log(err.message);
        res.status(400).json({ message: err.message });
      } else {
        // delete previous profile pic before uploading new one
        const user = await User.findOne({ username: req.body.username });
        if (user.profilePic != "avatar.png") {
          fs.unlinkSync(`${appDir}/public/uploads/${user.profilePic}`);
          console.log("previous PP deleted");
        }
        // fetch user info from db and update their profile pic
        await User.findOneAndUpdate(
          { username: req.body.username },
          {
            $set: { profilePic: req.file.filename },
          }
        );
        console.log(req.file);
        res
          .status(200)
          .json({ message: "success", filename: req.file.filename });
      }
    });
  },
};
