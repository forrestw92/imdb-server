const JWTService = require('../services/auth.service')
const HttpStatus = require('http-status-codes')

module.exports = (req, res, next) => {
  let tokenToVerify

  if (req.header('Authorization')) {
    const parts = req.header('Authorization').split(' ')

    if (parts.length === 2) {
      const scheme = parts[0]
      const credentials = parts[1]

      if (/^Bearer$/.test(scheme)) {
        tokenToVerify = credentials
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ msg: 'Format for Authorization: Bearer [token]' })
      }
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ msg: 'Format for Authorization: Bearer [token]' })
    }
  } else {
    return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid Authorization' })
  }

  return JWTService().verify(tokenToVerify, (err, thisToken) => {
    if (err && thisToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid Authorization' })
    }
    req.token = thisToken
    return next()
  })
}
