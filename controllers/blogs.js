const blogsRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("../tests/test_helper");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user");
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const blog = new Blog(request.body);
  const UsersInDb = await helper.usersInDb();
  let randomUser = UsersInDb[Math.floor(Math.random() * UsersInDb.length)];
  const username = randomUser.username;

  const user = await User.findOne({ username });
  console.log(user);

  if (!blog.title && !blog.url) {
    response.status(400).json("Bad Request");
  } else {
    if (!blog.likes) {
      blog["likes"] = 0;
    }
    try {
      blog["user"] = user._id;
      const result = await blog.save();
      user.blogs = user.blogs.concat(result._id);
      await user.save();
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
});

blogsRouter.delete("/:id", async (req, res, next) => {
  try {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (req, res, next) => {
  const body = req.body;

  if (!body.likes) {
    body["likes"] = 0;
  }

  let blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const blogtobeupdated = await Blog.findByIdAndUpdate(req.params.id, blog, {
      new: true,
      runValidators: true,
      context: "query",
    });
    res.json(blogtobeupdated);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
