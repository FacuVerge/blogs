const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  	response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
	const blog = await Blog.findById(request.params.id)
	if (blog) {
		response.json(blog)
	} else {
		response.status(404).end()
	}
})

blogsRouter.post('/', async (request, response, next) => {
  	const body = request.body
  	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: request.user.id
  	})

	const savedBlog = await blog.save()
	request.user.blogs = request.user.blogs.concat(savedBlog._id)  
	await request.user.save()
	response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
	const blog = await Blog.findById(request.params.id)
	if (blog && blog.user.toString() === request.user.id.toString() ) {
		blog.deleteOne().then(response.status(204).end());
	} else {
		response.status(401).json({error: 'Blog can not be deleted'})
	}
})

blogsRouter.put('/:id', async (request, response, next) => {
	const body = request.body

	const blog = new Blog({
		_id: request.params.id,
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
  	})

  	blog.save()
		.then(updatedBlog => {
	  		response.json(updatedBlog)
		})
		.catch(error => next(error))
})

module.exports = blogsRouter