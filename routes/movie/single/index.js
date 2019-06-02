const {
  UserMovies,
  Movies,
  MovieData,
  UserRating
} = require('../../../models/')
const HttpStatus = require('http-status-codes')
module.exports = async (req, res) => {
  const { movieID } = req.body
  const { token } = req

  try {
    const singleMovie = await UserMovies.findOne({
      where: { movieID, userID: token.id }
    })
    if (singleMovie) {
      const movieData = await Movies.findOne({
        where: { movieID },
        include: [MovieData, UserRating, UserMovies]
      })
      if (movieData) {
        return res.status(200).json({ movieData })
      }
    }
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ error: 'Movie not in list' })
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
