const { test, after, before, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {

    let token = '';

    before(async () => {
        const user = {
            username: 'facru',
            name: 'Superuser',
            password: 'fgjfhjfjf'
        }
		await api.post('/api/users').send(user).expect(201).expect('Content-Type', /application\/json/)
        token = (await api.post('/api/login').send(user).expect(200).expect('Content-Type', /application\/json/)).body.token
    })

    beforeEach(async () => {  
        await Blog.deleteMany({})  
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')
      
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
      
    test('the first blog is about HTTP methods', async () => {
        const response = await api.get('/api/blogs')
      
        const titles = response.body.map(e => e.title)
        assert(titles.includes('Dracula'))
    })

    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()
      
        const blogToView = blogsAtStart[0]
      
        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
      
        assert.deepStrictEqual(resultBlog.body, blogToView)
    })
    
    test('blog property id is defined', async () => {
    
        const blogsAtStart = await helper.blogsInDb()
      
        const blogToView = blogsAtStart[0]
      
        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
      
        assert.deepStrictEqual(resultBlog.body.id, blogToView.id)
    })

    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: 'async/await simplifies making async calls',
            author: 'me',
            url: "dffdgfdg",
            likes: 0
        }

        await api
            .post('/api/blogs')
            .auth(token, {type: "bearer"})
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()  
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
        const titles = blogsAtEnd.map(n => n.title)
      
        assert(titles.includes('async/await simplifies making async calls'))
    })

    test('blog without title is not added', async () => {
        const newBlog = {
            url: ""
        }

        await api
            .post('/api/blogs')
            .auth(token, {type: "bearer"})
            .send(newBlog)
            .expect(400)
      
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    
    test('blog without url is not added', async () => {
        const newBlog = {
            title: "",
            author: "",
            likes: 3
        }

        await api
            .post('/api/blogs')
            .auth(token, {type: "bearer"})
            .send(newBlog)
            .expect(400)
      
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    
    test('blog without likes has zero', async () => {
        const newBlog = {
            title: "A blog",
            url: "dfhgch",
            author: "Me"
        }

        await api
            .post('/api/blogs')
            .auth(token, {type: "bearer"})
            .send(newBlog)
            .expect(201)
      
        const blogsAtEnd = await helper.blogsInDb()
      
        const likes = blogsAtEnd.map(r => r.likes)
        assert(likes.includes(0))
    })

    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
      
      
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
      
        const titles = blogsAtEnd.map(r => r.title)
        assert(!titles.includes(blogToDelete.title))
      
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

})

after(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await mongoose.connection.close()
})



