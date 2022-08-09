const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs.reduce(
        (likes, blog) => (blog.likes > likes ? blog.likes : likes),
        blogs[0].likes
      );
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    let Count = blogs.reduce((authorCount, blog) => {
      authorCount[blog.author] = (authorCount[blog.author] || 0) + 1;
      return authorCount;
    }, {});
    let maxim = Math.max(...Object.values(Count));
    let popularAuthor = Object.keys(Count).filter(
      (author) => Count[author] === maxim
    );
    return { author: popularAuthor[0], blogs: maxim };
  }
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    let Count = blogs.reduce((likeCount, blog) => {
      likeCount[blog.author] = (likeCount[blog.author] || 0) + blog.likes;
      return likeCount;
    }, {});
    let maxim = Math.max(...Object.values(Count));
    let popularAuthor = Object.keys(Count).filter(
      (author) => Count[author] === maxim
    );
    return { author: popularAuthor[0], likes: maxim };
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
