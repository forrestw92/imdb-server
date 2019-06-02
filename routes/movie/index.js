const models = require('express').Router()
const add = require('./add')
const del = require('./delete')
const search = require('./search')
const single = require('./single')
const page = require('./page')
const rate = require('./rate')

models.get('/search/:searchTerm', search)
models.post('/add', add)
models.post('/rate', rate)
models.post('/delete', del)
models.get('/page/:page', page)
models.get('/:movieID', single)

module.exports = models
