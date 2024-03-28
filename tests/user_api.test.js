const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const helper = require('./test_helper')

const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(helper.rootUser.password, saltRounds)

        const user = new User({
            username: helper.rootUser.username,
            name: helper.rootUser.name,
            passwordHash
        })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = helper.validUser

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, userAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('username already taken', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = helper.rootUser

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, userAtStart.length)
    })
})

describe('missing properties', () => {
    test('missing username', async () => {
        const userAtStart = await helper.usersInDb()

        const invalidUser = helper.missingUsernameUser

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, userAtStart.length)

    })

    test('missing password', async () => {
        const userAtStart = await helper.usersInDb()

        const invalidUser = helper.missingPasswordUser

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, userAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        assert(!usernames.includes(invalidUser.username))

    })
})

describe('min length properties', () => {
    test('minLength 3 username', async () => {
        const userAtStart = await helper.usersInDb()

        const invalidUser = helper.usernameLength

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, userAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        assert(!usernames.includes(invalidUser.username))
    })

    test('minLength 3 password', async () => {
        const userAtStart = await helper.usersInDb()

        const invalidUser = helper.passwordLength

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, userAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        assert(!usernames.includes(invalidUser.username))
    })
})

after(async () => {
    await mongoose.connection.close()
})