const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')

let userToken

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    let userObject = new User(await helper.hashedValidUser())
    await userObject.save()

    const savedBlogs = await Blog.insertMany(
        helper.initialBlogs.map(b => ({
            ...b,
            user: userObject
        }))
    )
    userObject.blogs = userObject.blogs.concat(savedBlogs.map(b => b._id))
    await userObject.save()

    userToken = jwt.sign(
        {
        username: userObject.username,
        id: userObject.id
        },
        process.env.SECRET
    )
})

describe('checking returned properties', () => {
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

})

describe('creating a blog with valid data', () => {
    test('successfully creates a new blog', async () => {
        const initialBlogs = await helper.getBlogsInDb();
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${userToken}`)
            .send(helper.validBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
        const titles = response.body.map(r => r.title)
    
        assert.strictEqual(response.body.length, initialBlogs.length + 1)
        assert(titles.includes(helper.validBlog.title))
    })

    test('creating a blog without a token, 401 unauthorized', async () => {
        await api
            .post('/api/blogs')
            .send(helper.validBlog)
            .expect(401)
    })
})

describe('creating a blog with missing properties', () => {
    test('likes property is missing from the request', async () => {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${userToken}`)
            .send(helper.missingLikesBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
            .expect(function (res) {
                assert.strictEqual(res.body.likes, 0)
            })
    })

    test('title property is missing, 400 bad request', async () => {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${userToken}`)
            .send(helper.missingTitle)
            .expect(400)
    })

    test('url property is missing, 400 bad request', async () => {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${userToken}`)
            .send(helper.missingUrl)
            .expect(400)
    })
})

describe('deleting a blog', () => {
    test('succesfuly delete a blog', async () => {
        const initialBlogs = await helper.getBlogsInDb();
        const blogToDelete = initialBlogs[0]
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(204)
    
        const blogsAfterDelete = await helper.getBlogsInDb()
    
        assert.strictEqual(blogsAfterDelete.length, initialBlogs.length - 1)
        assert(!blogsAfterDelete.includes(blogToDelete))
    })

    test('deleting a blog without a token, 401 unauthorized', async () => {
        const initialBlogs = await helper.getBlogsInDb();
        const blogToDelete = initialBlogs[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)
    })
})

describe('updating a blog', () => {
    test('sucessfuly updates a blog', async () => {
        const initialBlogs = await helper.getBlogsInDb();
        const blogToUpdate = initialBlogs[0]
    
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(helper.validBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const checkBlogs = await helper.getBlogsInDb()
        const checkTitle = checkBlogs.map(b => b.title)
    
        assert.strictEqual(initialBlogs.length, checkBlogs.length)
        assert(checkTitle.includes(helper.validBlog.title))
    })

    test('updating a blog without a token, 401 unauthorized', async () => {
        const initialBlogs = await helper.getBlogsInDb();
        const blogToUpdate = initialBlogs[0]
    
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(helper.validBlog)
            .expect(401)
    })

})

after(async () => {
    await mongoose.connection.close()
})