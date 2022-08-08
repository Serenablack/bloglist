const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.like, 0);
};

const favoriteBlog = (blogs) => {
    return blog.find((x)=>x.likes>x)
};
module.exports = {
  dummy,
  totalLikes,
};
