const blogsRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const blog = new Blog(request.body);
  if (!blog.title && !blog.url) {
    response.status(400).json("Bad Request");
  } else {
    if (!blog.likes) {
      blog["likes"] = 0;
    }
    try {
      const result = await blog.save();
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

module.exports = blogsRouter;
