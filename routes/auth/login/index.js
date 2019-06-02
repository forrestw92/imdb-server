const authService = require('../../../services/auth.service')
const bcryptService = require('../../../services/bcrypt.service')
const { Users } = require('../../../models/')
const HttpStatus = require('http-status-codes')

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await Users.findOne({ where: { email } })
    if (user) {
      const checkedPassword = await bcryptService().comparePassword(
        password,
        user.password
      )
      if (checkedPassword) {
        const token = await authService().issue({
          id: user.id,
          email: user.email
        })
        return res.status(HttpStatus.OK).json({ token })
      }
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: 'Invalid password' })
    } else {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: 'Account does not exists' })
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
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error })
  }
}
