const Blog = require('../models/blog')

const getBlogsInDb = async () => {
    const getBlogs = await Blog.find({})
    return getBlogs.map(b => b.toJSON())
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

module.exports = {
    getBlogsInDb,
    initialBlogs,
    validBlog,
    missingLikesBlog,
    missingTitle,
    missingUrl
}