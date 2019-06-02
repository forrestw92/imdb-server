const jwt = require('jsonwebtoken')
require('dotenv').config()

const secret = process.env.SECRET_TOKEN

const authService = () => {
  const issue = payload => jwt.sign(payload, secret, { expiresIn: '30d' })
  const verify = (token, cb) => jwt.verify(token, secret, {}, cb)

  return {
    issue,
    verify
  }
}

module.exports = authService
