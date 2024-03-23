const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

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

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('id and not _id as a unique identifier property of the blog', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect(function (res) {
            assert.notStrictEqual(res.body[0].id, undefined, 'id is undefined or not exist')
        })
})

test('successfully creates a new blog post', async () => {
    const newBlog = {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(titles.includes(newBlog.title))
})

describe('missing properties', () => {
    test('likes property is missing from the request', async () => {
        const missingLikesBlog = {
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        }
    
        await api
            .post('/api/blogs')
            .send(missingLikesBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
            .expect(function (res) {
                assert.strictEqual(res.body.likes, 0)
            })
    })

    test('title property is missing 400 bad request', async () => {
        const missingTitle = {
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
        }

        await api
            .post('/api/blogs')
            .send(missingTitle)
            .expect(400)
    })

    test('url property is missing 400 bad request', async () => {
        const missingUrl = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        }

        await api
            .post('/api/blogs')
            .send(missingUrl)
            .expect(400)
    })
})

test('delete a blog', async () => {
    const getBlogs = await Blog.find({})
    const blogs = getBlogs.map(b => b.toJSON())
    const blogToDelete = blogs[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const getBlogsAfterDelete = await Blog.find({})
    const blogsAfterDelete = getBlogsAfterDelete.map(b => b.toJSON())

    assert.strictEqual(blogsAfterDelete.length, blogs.length - 1)
    assert(!blogsAfterDelete.includes(blogToDelete))

})

test('update a blog', async () => {
    
})

after(async () => {
    await mongoose.connection.close()
})