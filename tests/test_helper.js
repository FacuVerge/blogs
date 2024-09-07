const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [  
    {    
        title: 'Dracula',    
        author: 'Dan Brown',
        url: "https://danbrown.com",
        likes: 7  
    },  
    {    
        title: 'Frankenstein',    
        author: 'Mary Shelley',
        url: "https://maryshelley.com",
        likes: 10
    }
]

const nonExistingId = async () => {
    const blog = new Blog({  
        title: 'Dracula',    
        author: 'Dan Brown',
        url: "https://danbrown.com",
        likes: 7  
    })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}
  
module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb,
}