const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const logger = require("../utils/logger");

const Blog = require("../models/blog");
const User = require("../models/user");

// const userExtractor = require("../utils/middleware");

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
  // const username = request.user;

  // console.log(username);
  // const UsersInDb = await helper.usersInDb();
  // let randomUser = UsersInDb[Math.floor(Math.random() * UsersInDb.length)];
  // const username = randomUser.username;
  const token = request.token;

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  // const user = await User.findOne({ username });

  if (!blog.title && !blog.url) {
    return response.status(400).json("Bad Request");
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
      // response.send(username);
    } catch (error) {
      next(error);
    }
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const token = request.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);

  const user = await User.findById(decodedToken.id);
  const blogDelete = await Blog.findById(request.params.id);

  if (blogDelete.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    try {
      response.status(204).json("blog successfully deleted").end();
    } catch (error) {
      next(error);
    }
  } else {
    return response.status(401).json({ error: "Invalid move" });
  }
});

blogsRouter.put("/:id", async (req, res, next) => {
  const body = req.body;
  console.log(body);
  if (!body.likes) {
    body["likes"] = 0;
  }
  const token = req.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);

  const user = await User.findById(decodedToken.id);
  const blogUpdate = await Blog.findById(req.params.id);

  if (blogUpdate.user._id.toString() === user._id.toString()) {
    let blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };
    try {
      const blogtobeupdated = await Blog.findByIdAndUpdate(
        req.params.id,
        blog,
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );
      logger.info(`blog ${blog.title} updated successfully`);
      res.json(blogtobeupdated);
    } catch (error) {
      next(error);
    }
  }
});

module.exports = blogsRouter;
