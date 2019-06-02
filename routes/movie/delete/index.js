const { UserMovies } = require('../../../models/')
const HttpStatus = require('http-status-codes')

module.exports = async (req, res) => {
  const { movieID } = req.body
  const { token } = req

  try {
    const hasMovie = await UserMovies.findOne({
      where: { movieID, userID: token.id }
    })
    if (hasMovie) {
      const deleteMovie = await UserMovies.destroy({
        where: { movieID, userID: token.id }
      })
      if (deleteMovie) {
        return res
          .status(HttpStatus.OK)
          .json({ message: 'Deleted movie from list' })
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Error deleting movie from list' })
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: 'Movie does not exists in list' })
  } catch (error) {
    const { errors } = error
    if (errors) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors: errors.map(error => ({
          msg: error.message,
          value: error.value
        }))
      })
    }
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Error' })
  }
}
