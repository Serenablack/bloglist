require("dotenv").config();
const port = process.env.PORT || 3003;
const MongoDB = process.env.MONGODB_URI;

module.exports = { port, MongoDB };
