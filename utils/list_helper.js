var collection = require('lodash');

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    
    const reducer = (sum, item) => {
        return sum + item
    }

    return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    var res = Math.max(...blogs.map(blog => blog.likes))
    return blogs.find(blog => blog.likes === res)
}

const mostBlogs = (blogList) => {
    const authorBlogCount = {};

    blogList.forEach(blog => {
        if (authorBlogCount[blog.author]) {
            authorBlogCount[blog.author] += 1;
        } else {
            authorBlogCount[blog.author] = 1;
        }
    });

    const result = Object.keys(authorBlogCount).map(author => {
        return {
            author: author,
            blogs: authorBlogCount[author]
        };
    });

    return result;
}

const mostLikes = (blogList) => {
    const authorBlogCount = {};

    blogList.forEach(blog => {
        if (authorBlogCount[blog.author]) {
            authorBlogCount[blog.author] += blog.likes;
        } else {
            authorBlogCount[blog.author] = blog.likes;
        }
    });

    const result = Object.keys(authorBlogCount).map(author => {
        return {
            author: author,
            likes: authorBlogCount[author]
        };
    });

    return result;
}
  
module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}