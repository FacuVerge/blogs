const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]
  
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('when list has two blogs, equals the sum of that elements', () => {
        const result = listHelper.totalLikes(listWithOneBlog.concat(listWithOneBlog[0]))
        assert.strictEqual(result, 10)
    })

    test('when list has no blogs, equals zero', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })

})

describe('favorite blog', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]
  
    test('when list has only one blog, that is the favorite', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.strictEqual(result, listWithOneBlog[0])
    })

    test('when list has two blogs, equals the one with more likes', () => {
        const newElement = {
            _id: '5a422aa71b54a676234417f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 7,
            __v: 0
        }
        const result = listHelper.favoriteBlog(listWithOneBlog.concat(newElement))
        assert.deepStrictEqual(result, newElement)
    })

    test('when list has no blogs, favorite blog is undefined', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, undefined)
    })

})

describe('most blogs', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    const listWithThreeBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }, 
        {
            _id: '5a422aa71b57a676234d17f8',
            title: 'Frankenstein',
            author: 'Mary Shelley',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71754a676234d17f8',
            title: 'Frankenstein',
            author: 'Mary Shelley',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]
  
    test('when list has three blogs and two authors', () => {
        const expected = [
        {
            author: 'Edsger W. Dijkstra',
            blogs: 1
        }, 
        {
            author: 'Mary Shelley',
            blogs: 2
        }
        ]
        const result = listHelper.mostBlogs(listWithThreeBlogs)
        assert.deepEqual(result, expected)
    })
    
    test('when list has one blog', () => {
        const expected = [{author: 'Edsger W. Dijkstra', blogs: 1}]
        const result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, expected)
    })

    test('when list has no blogs, favorite blog is undefined', () => {
        const result = listHelper.mostBlogs([])
        assert.deepEqual(result, [])
    })
    
})

describe('most likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    const listWithThreeBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }, 
        {
            _id: '5a422aa71b57a676234d17f8',
            title: 'Frankenstein',
            author: 'Mary Shelley',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71754a676234d17f8',
            title: 'Frankenstein',
            author: 'Mary Shelley',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]
  
    test('when list has three blogs and two authors', () => {
        const expected = [
        {
            author: 'Edsger W. Dijkstra',
            likes: 5
        }, 
        {
            author: 'Mary Shelley',
            likes: 10
        }
        ]
        const result = listHelper.mostLikes(listWithThreeBlogs)
        assert.deepEqual(result, expected)
    })
    
    test('when list has one blog', () => {
        const expected = [{author: 'Edsger W. Dijkstra', likes: 5}]
        const result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, expected)
    })

    test('when list has no blogs, favorite blog is undefined', () => {
        const result = listHelper.mostLikes([])
        assert.deepEqual(result, [])
    })
    
})