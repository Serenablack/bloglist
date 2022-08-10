const blogsRouter = require("express").Router();
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

module.exports = blogsRouter;
