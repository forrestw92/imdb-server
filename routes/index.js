const models = require('express').Router()
const movies = require('./movie')
const auth = require('./auth')
const protect = require('../policies/auth.policy')

models.use('/auth', auth)
models.use('/movies', movies)

module.exports = models
