const Blog = require("../models/BlogModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { TOKEN_SECRET } = process.env;
const moment = require("moment");

const Utils = require("../utils/utils");
const User = require("../models/UserModel");

class BlogController {
  /**
   * POST request to /blog.
   * Handles all the logic responsible for sumbitting a new blog to the database.
   */
  static submitBlog = async (req, res) => {
    try {
      const { title, snippet, body, author } = req.body;
      const blog = await Blog.create({ title, snippet, body, author });
      res.status(201).json({ message: "success" });
      console.log("new blog created");
    } catch (err) {
      const errors = Utils.handleErrors(err);
      res.status(400).json({ errors });
    }
  };

  /**
   * GET request to /user/blogs.
   * Responsible for getting the most recent blogs of the user. This are the blogs displayed on the user's Dashboard. This doesn't show all the blogs posted by the user.
   */
  static getBlogs = async (req, res) => {
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
        }
      });
    }
  };

  /**
   * GET request to /blog/:author/:id.
   * Find and returns specific blog posted by a specific author.
   */
  static getSingleBlog = async (req, res) => {
    const { author, id } = req.params;
    try {
      // query db and send blog into the blog view
      const blog = await Blog.findById(id);

      if (blog == null) {
        throw Error("blog deleted or does not exist");
      } else {
        res.render("blog", {
          blog,
          author,
          title: `${blog.title}`,
          cssfile: "blog",
          moment,
        });
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
  };

  /**
   * GET request to /blogs/:author.
   * Find and returns all blogs posted by a specific author.
   */
  static getAuthorBlogs = async (req, res) => {
    let { author } = req.params;
    try {
      const blogs = await Blog.find({ author }).sort({
        createdAt: "-1",
      });

      if (JSON.stringify(blogs) == "[]") {
        throw Error(
          "this author has not posted any blog or the author does not exist"
        );
      } else {
        author = author[0].toUpperCase() + author.slice(1);
        res.render("author-blogs", {
          blogs,
          author,
          title: `${author} blogs`,
          cssfile: "author-blog",
        });
      }
    } catch (err) {
      console.log(err.message);
      res.status(400).send(`<h1>${err.message}</h1>`);
    }
  };

  /**
   * DELETE request to /blog.
   * Responsible for deleting a blog when the delete icon is clicked on.
   */
  static deleteBlog = async (req, res) => {
    const { blogId } = req.body;

    try {
      await Blog.findByIdAndDelete(blogId);
      res.status(200).json({ message: "blog deleted successfully" });
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * PUT request to /blogs.
   * Responsible for updating an already existing blog
   */
  static updateBlog = async (req, res) => {
    const { blogId, ...data } = req.body;
    await Blog.findByIdAndUpdate(blogId, { $set: data });

    res.json({ message: "blog updated" });
  };
}

module.exports = BlogController;
