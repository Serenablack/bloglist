const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
    likes: 1,
  });
  response.json(users.map((user) => user.toJSON()));
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;
  if (!(username || password) || password.length < 3 || username.length < 3) {
    return response.status(400).json({
      error: `User validation failed: username: Path password is shorter than the minimum allowed length (3).`,
    });
  } else {
    const existingUser = await User.findOne({ username });
    // try {
    if (existingUser) {
      return response.status(400).json({
        error: "username must be unique",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
    // } catch (error) {
    //   next(error);
    // }
  }
});

module.exports = usersRouter;
