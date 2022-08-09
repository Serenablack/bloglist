require("dotenv").config();
const port = process.env.PORT || 3003;
const MongoDB =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = { port, MongoDB };
