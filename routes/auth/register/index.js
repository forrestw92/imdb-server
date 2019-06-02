const authService = require('../../../services/auth.service')
const bcryptService = require('../../../services/bcrypt.service')
const { Users } = require('../../../models/')
const HttpStatus = require('http-status-codes')

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await Users.findOne({ where: { email } })
    if (!user) {
      const newUser = await Users.create({
        email,
        password
      })
      const token = await authService().issue({
        id: newUser.id,
        email: newUser.email
      })
      res.status(HttpStatus.CREATED).json({ token })
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Email already taken' })
    }
  } catch (error) {
    const { errors } = error
    if (errors) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors: errors.map(error => ({
          msg: error.message
        }))
      })
    }
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Error' })
  }
}
