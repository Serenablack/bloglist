const listhelper = require("../utils/list_helper");

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

describe("totalLikes returns sum of likes", () => {
  test("of an empty blog list is zero", () => {
    const result = listhelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test("of single blog in list returns likes of that blog", () => {
    const blog = blogs[0];
    const result = listhelper.totalLikes([blog]);
    expect(result).toBe(blog.likes);
  });
  test("of multiple blogs equals sum of likes of each of the blog combined", () => {
    const result = listhelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});

describe("favoriteBlog returns favorite blog", () => {
  test("of an empty blog list is empty object", () => {
    const result = listhelper.favoriteBlog([]);
    expect(result).toEqual({});
  });

  test("of single blog in list returns that blog", () => {
    const blog = blogs[0];
    const onlyLike = listhelper.favoriteBlog([blog]);
    const result = blogs.find((blog) => blog.likes === onlyLike);
    expect(result).toEqual(blog);
  });
  test("of multiple blogs equals the first blog with the most likes", () => {
    const mostLikes = listhelper.favoriteBlog(blogs);
    const result = blogs.find((blog) => blog.likes === mostLikes);
    expect(result).toEqual(blogs[2]);
  });
});

describe("mostBlog returns author with the most blogs and their blog", () => {
  test("of an empty blog list is empty object", () => {
    const result = listhelper.mostBlogs([]);
    expect(result).toEqual({});
  });

  test("of single blog in list returns the author and their blog", () => {
    const blog = blogs[0];
    const result = listhelper.mostBlogs([blog]);
    expect(result).toEqual({ author: blog.author, blogs: 1 });
  });
  test("of multiple blogs equals the first blog author with most blogs and their blog", () => {
    const result = listhelper.mostBlogs(blogs);
    expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 });
  });
});

describe("mostBlog returns author with the most likes and their likes", () => {
  test("of an empty blog list is empty object", () => {
    const result = listhelper.mostLikes([]);
    expect(result).toEqual({});
  });

  test("of single blog in list returns the author and their blog likes", () => {
    const blog = blogs[0];
    const result = listhelper.mostLikes([blog]);
    expect(result).toEqual({ author: blog.author, likes: blog.likes });
  });
  test("of multiple blogs equals the first blog author with most likes and the like count", () => {
    const result = listhelper.mostLikes(blogs);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
