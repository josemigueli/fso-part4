const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    const favBlog = blogs.reduce((mostLiked, blog) => {
        return mostLiked.likes >= blog.likes ? mostLiked : blog
    }, blogs[0])

    return {
        title: favBlog.title,
        author: favBlog.author,
        likes: favBlog.likes
    }
}

const mostBlogs = (blogs) => {
    const authorWithMostBlogs = _(blogs)
        .groupBy('author')
        .map(objs => ({
            author: objs[0].author,
            blogs: objs.length
        }))
        .maxBy('blogs')

    return authorWithMostBlogs
}

const mostLikes = (blogs) => {
    const mostLiked = _(blogs)
        .groupBy('author')
        .map(objs => ({
            author: objs[0].author,
            likes: _.sumBy(objs, 'likes')
        }))
        .maxBy('likes')
        
    return mostLiked
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}