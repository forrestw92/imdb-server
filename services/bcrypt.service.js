const bcrypt = require('bcrypt-nodejs')

const bcryptService = () => {
  const password = async password => {
    let hash = bcrypt.genSaltSync(8)
    return bcrypt.hashSync(password, hash)
  }

  const comparePassword = async (pw, hash) => bcrypt.compareSync(pw, hash)

  return {
    password,
    comparePassword
  }
}

module.exports = bcryptService
