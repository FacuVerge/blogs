const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1})
	response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
	const {username, name, password} = request.body
	
	let error = {
		message : ""
	};

	if (!password) {
		error.message = "Password is required"
		response.status(400).json(error)
	} 

	if (!username) {
		error.message = "Username is required" 
		response.status(400).json(error)
	}

	if (password.length < 3) {
		error.message = "Password length must be at least 3 characters" 
		response.status(400).json(error)
	}

	if (username.length < 3) {
		error.message = "Username length must be at least 3 characters"
		response.status(400).json(error)
	}

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const user = new User({
		username,
		name,
		passwordHash,
	})

	const savedUser = await user.save()

	if(!error.message) {
		response.status(201).json(savedUser)
	}
 
})

module.exports = usersRouter