const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

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

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(newBlog[0]);
  await blogObject.save();
  blogObject = new Blog(newBlog[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(newBlog.length);
});

test("a specific blog is present in the resturned bloglist", async () => {
  const response = await api.get("/api/blogs");
  const title = response.body.map((x) => x.title);
  expect(title).toContain("React patterns");
});

test("the unique identifier property of the blog posts is its id", async () => {
  const blog = await Blog.find({});

  expect(blog[0]._id).toBeDefined();
});

test("a valid blog is added", async () => {
  const createdBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(createdBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const response = await api.get("/api/blogs");
  const title = response.body.map((x) => x.title);
  expect(response.body).toHaveLength(newBlog.length + 1);
  expect(title).toContain("First class tests");
});

test("blog without likes will default to the value 0", async () => {
  const createdBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
  };

  await api
    .post("/api/blogs")
    .send(createdBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  console.log(response.body);
  const blog = response.body.map((x) => x);
  console.log(blog);
  const blogPosted = await blog.find((x) => x.title === "First class tests");
  expect(blogPosted.likes).toBe(0);
});

afterAll(() => {
  mongoose.connection.close();
});
