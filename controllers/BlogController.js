const Blog = require("../models/BlogModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { TOKEN_SECRET } = process.env;

const { handleErrors } = require("../utils/utils");
const User = require("../models/UserModel");

module.exports = {
  submitBlog: async (req, res) => {
    try {
      const { title, snippet, body, author } = req.body;
      const blog = await Blog.create({ title, snippet, body, author });
      res.status(201).json({ message: "success" });
      console.log("new blog created");
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  },

  getBlogs: async (req, res) => {
    /**
     * Get blogs published by currently logged in user
     * 1. Check if a user is logged in by checking if token exist
     * 2. If token exist, verify it.
     * 3. Use the id in the decodedToken to get the user info from db
     * 4. Find all blogs published by the logged in user with the username from step 3
     */
    const token = req.cookies.btoken;

    if (token) {
      // verify token & open protected route
      jwt.verify(token, TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err);
        } else {
          //  grab logged in user info from db and
          const user = await User.findById(decodedToken.id);
          // find all blogs published by currently logged in user
          const blogs = await Blog.find({ author: user.username })
            .sort({
              createdAt: "-1",
            })
            .limit(3);
          // send the blogs to the client
          res.status(200).json({ blogs });

          // end else
        }
      });
    }
  },

  getSingleBlog: async (req, res) => {
    const { author, id } = req.params;
    try {
      // query db and send blog into the blog view
      const blog = await Blog.findById(id);

      if (blog == null) {
        throw Error("blog deleted or does not exist");
      } else {
        res.render("blog", { blog, author, title: `${blog.title}` });
      }
    } catch (err) {
      console.log(err.message);
      res
        .status(400)
        .send(
          err.message.includes("blog")
            ? err.message
            : "<h1>unable to get blog. invalid id<h1>"
        );
    }
  },

  getAuthorBlogs: async (req, res) => {
    const { author } = req.params;
    try {
      const blogs = await Blog.find({ author }).sort({
        createdAt: "-1",
      });

      if (JSON.stringify(blogs) == "[]") {
        throw Error(
          "this author has not posted any blog or the author does not exist"
        );
      } else {
        res.render("author-blogs", { blogs, author, title: `${author} blogs` });
      }
    } catch (err) {
      console.log(err.message);
      res.status(400).send(`<h1>${err.message}</h1>`);
    }
  },

  deleteBlog: async (req, res) => {
    const { blogId } = req.body;

    try {
      await Blog.findByIdAndDelete(blogId);
      res.status(200).json({ message: "blog deleted successfully" });
    } catch (err) {
      console.log(err);
    }
  },
};
