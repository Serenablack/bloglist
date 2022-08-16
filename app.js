// const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");

const loginRouter = require("./controllers/login");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
// const mongoUrl = "mongodb://localhost/bloglist";
// mongoose.connect(mongoUrl);
mongoose
  .connect(config.MongoDB)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.info("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
// app.use(middleware.userExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// const PORT = 3003;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
