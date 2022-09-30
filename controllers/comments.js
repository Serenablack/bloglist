const commentsRouter = require("express").Router();
// const logger = require("../utils/logger");

const Comment = require("../models/comment");
// const Blog = require("../models/blog");

commentsRouter.get("/:id/comments", async (request, response, next) => {
  try {
    const comments = await Comment.find({ blog_id: request.params.id });

    response.json(comments);
  } catch (error) {
    next(error);
  }
});

commentsRouter.post("/:id/comments", async (request, response, next) => {
  try {
    const comment = new Comment({
      comment: request.body.comment,
      blog_id: request.params.id,
    });
    console.log(comment);
    const newComment = await comment.save();

    response.send(newComment);
  } catch (error) {
    next(error);
  }

  // const user = await User.findOne({ username });
});

module.exports = commentsRouter;
