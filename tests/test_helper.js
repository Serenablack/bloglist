const Blog = require("../models/blog");
const User = require("../models/user");

const newBlog = [
  {
    id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

const blogsInDb = async () => {
  const notes = await Blog.find({});
  return notes.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const notes = await User.find({});
  return notes.map((u) => u.toJSON());
};

module.exports = {
  newBlog,
  blogsInDb,
  usersInDb,
};
