const models = require('express').Router()
const login = require('./login')
const register = require('./register')

models.post('/login', login)
models.post('/register', register)

module.exports = models
