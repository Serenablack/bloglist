const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = helper.newBlog.map((blog) => new Blog(blog));
  const promiseArray = blogObject.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("when there are blogs saved in the database", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two blogs", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.newBlog.length);
  });

  test("a specific blog is present in the returned bloglist", async () => {
    const response = await api.get("/api/blogs");
    const title = response.body.map((x) => x.title);
    expect(title).toContain("React patterns");
  });
});

test("the unique identifier property of the blog posts is its id", async () => {
  const blog = await Blog.find({});

  expect(blog[0]._id).toBeDefined();
});

describe("addition of a new blog", () => {
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
    const blog = await helper.blogsInDb();
    const title = blog.map((x) => x.title);
    expect(blog).toHaveLength(helper.newBlog.length + 1);
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

    const bloginDB = await helper.blogsInDb();
    const blog = bloginDB.map((x) => x);
    const blogPosted = await blog.find((x) => x.title === "First class tests");
    expect(blogPosted.likes).toBe(0);
  });

  test(" if there is no title and url properties,status code 400 Bad Request is sent as response", async () => {
    const createdBlog = {
      author: "Robert C. Martin",
      likes: 10,
    };
    await api
      .post("/api/blogs")
      .send(createdBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const blogsInDb = await helper.blogsInDb();

    expect(blogsInDb).toHaveLength(helper.newBlog.length);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsBefore = await helper.blogsInDb();
    const blogToDelete = blogsBefore[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAfter = await helper.blogsInDb();

    expect(blogsAfter).toHaveLength(helper.newBlog.length - 1);

    const title = blogsAfter.map((r) => r.title);

    expect(title).not.toContain(blogToDelete.title);
  });
});

describe("update of a blog", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const blogsBefore = await helper.blogsInDb();
    const blogToDelete = blogsBefore[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAfter = await helper.blogsInDb();

    expect(blogsAfter).toHaveLength(helper.newBlog.length - 1);

    const title = blogsAfter.map((r) => r.title);

    expect(title).not.toContain(blogToDelete.title);
  });
});

test("Blog update successful", async () => {
  const Blogtobeupdated = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  };

  await api.post("/api/blogs").send(Blogtobeupdated).expect(201);

  const allBlogs = await helper.blogsInDb();
  const blogToUpdate = allBlogs.find(
    (blog) => blog.title === Blogtobeupdated.title
  );

  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAfter = await helper.blogsInDb();
  expect(blogsAfter).toHaveLength(helper.newBlog.length + 1);
  const blogupdated = blogsAfter.find((blog) => blog.likes === 3);
  expect(blogupdated.likes).toBe(3);
});

afterAll(() => {
  mongoose.connection.close();
});
