const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://facuverge:${password}@full-stack-course.i2ong.mongodb.net/testBlogsApp?retryWrites=true&w=majority&appName=Full-Stack-Course`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number

})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'Peter Pan',
  author: '',
  url: '',
  likes: 2
})

blog.save().then(result => {
  console.log('blog saved!')
  mongoose.connection.close()
})
