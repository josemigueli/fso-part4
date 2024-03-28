const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const getBlogsInDb = async () => {
    const getBlogs = await Blog.find({})
    return getBlogs.map(b => b.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    }
]

const validBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
}

const missingLikesBlog = {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
}

const missingTitle = {
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
}

const missingUrl = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12
}

const rootUser = {
    username: 'root',
    name: 'Superuser',
    password: 'password'
}

const validUser = {
    username: 'john_doe',
    name: 'John Doe',
    password: 'myAwesomePassword'
}

const missingUsernameUser = {
    name: 'John Doe',
    password: 'myAwesomePassword'
}

const missingPasswordUser = {
    username: 'john_doe',
    name: 'John Doe',
}

const usernameLength = {
    username: 'jo',
    name: 'John Doe',
    password: 'myAwesomePassword'
}

const passwordLength = {
    username: 'john_doe',
    name: 'John Doe',
    password: 'my'
}

const hashedValidUser = async () => {
    const passwordHash = await bcrypt.hash(validUser.password, 10)
    return {
        username: validUser.username,
        name: validUser.name,
        passwordHash
    }
}

module.exports = {
    getBlogsInDb,
    initialBlogs,
    validBlog,
    missingLikesBlog,
    missingTitle,
    missingUrl,
    usersInDb,
    validUser,
    rootUser,
    missingUsernameUser,
    missingPasswordUser,
    usernameLength,
    passwordLength,
    hashedValidUser
}