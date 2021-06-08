const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minlength: [5, "title should not be less than 5 characters"],
      trim: true,
    },
    snippet: {
      type: String,
      required: [true, "snippet is required"],
      minlength: [10, "snippet should not be less than 10 characters"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "body is required"],
      minlength: [20, "body should not be less than 20 characters"],
      trim: true,
    },
    author: {
      type: String,
      require: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
