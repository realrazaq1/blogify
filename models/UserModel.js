const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      lowercase: true,
      minlength: [2, "username cannot be less 2 characters"],
      maxlength: [15, "username should not be more than 15 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email address is required"],
      validate: [isEmail, "please enter a valid email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password cannot be less than 6 characters"],
    },
    profilePic: {
      type: String,
      default: "avatar.png",
      trim: true,
    },
  },
  { timestamps: true }
);

// hash user password before it's saved to DB
UserSchema.pre("save", async function (next) {
  // generate salt
  const salt = await bcrypt.genSalt();
  //hash password with the generated salt
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

module.exports = mongoose.model("User", UserSchema);
