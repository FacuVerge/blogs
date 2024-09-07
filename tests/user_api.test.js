const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

describe('when there is initially one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({})
		const passwordHash = await bcrypt.hash('sekret', 10)
		const user = new User({ username: 'root', passwordHash, name: 'facu' })
		await user.save()
	})

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen',
		}
		
		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		
		const usersAtEnd = await helper.usersInDb()
		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
		
		const usernames = usersAtEnd.map(u => u.username)
		assert(usernames.includes(newUser.username))
	})

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen',
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		
		assert.deepEqual(result.body.error, 'expected `username` to be unique')
		assert.strictEqual(usersAtEnd.length, usersAtStart.length)
	})

	test('creation fails with proper statuscode and message if password is missing', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'cafe',
			name: 'Superuser',
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		assert.notDeepEqual(result.body.error, 'Password is required')
		assert.strictEqual(usersAtEnd.length, usersAtStart.length)
	})

	test('creation fails with proper statuscode and message if username has two characters', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'ro',
			name: 'Superuser',
			password: 'salainen',
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		assert.notDeepEqual(result.body.error, 'Username length must be at least 3 characters')
		assert.strictEqual(usersAtEnd.length, usersAtStart.length)
	})

})

after(async () => {
	await User.deleteMany({})
	await mongoose.connection.close()
})