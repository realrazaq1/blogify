const multer = require("multer");
const path = require("path");
const User = require("../models/UserModel");
const fs = require("fs");
const appDir = path.dirname(require.main.filename);
const bcrypt = require("bcrypt");

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

class ProfileController {
  /**
   * GET request to /profile/:user.
   * Responsible for display the profile page of the currently logged in user.
   */
  static showProfile = (req, res) => {
    const { user } = req.params;
    res.render("profile", { title: "Profile", cssfile: "profile", name: user });
  };

  /**
   * POST request to /profile/upload_pp.
   * Handles all the logic responsible for uploading a new profile picture.
   */
  static uploadPP = (req, res) => {
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

        try {
          // check if file exist before deleting it.
          if (fs.existsSync(`${appDir}/public/uploads/${user.profilePic}`)) {
            if (user.profilePic != "avatar.png") {
              fs.unlinkSync(`${appDir}/public/uploads/${user.profilePic}`);
              console.log("previous profile pic deleted....");
            }
          }
        } catch (err) {
          console.log(err.message);
        }
        try {
          // fetch user info from db and update their profile pic
          await User.findOneAndUpdate(
            { username: req.body.username },
            {
              $set: { profilePic: req.file.filename },
            }
          );
          console.log("new file uploaded.... \n", req.file);
          res
            .status(200)
            .json({ message: "success", filename: req.file.filename });
        } catch (err) {
          console.log(err.message);
        }
      }
    });
  };

  static updatePassword = async (req, res) => {
    const { username, oldPw, newPw } = req.body;

    try {
      // fetch user from DB
      const user = await User.findOne({ username });
      // compare password with oldPw
      const match = await bcrypt.compare(oldPw, user.password);
      if (match) {
        // if password match, hash new password then update password
        const salt = await bcrypt.genSalt();
        const newPWHashed = await bcrypt.hash(newPw, salt);
        await User.findOneAndUpdate(
          { username },
          {
            $set: { password: newPWHashed },
          }
        );

        res.json({ message: "password updated" });
        console.log("password updated");
      } else {
        res.status(400).json({ message: "old password is invalid" });
      }
    } catch (err) {
      console.log(err.message);
    }
  };
}

module.exports = ProfileController;
