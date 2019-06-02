const {
  UserMovies,
  Movies,
  MovieData,
  UserRating
} = require('../../../models/')
const HttpStatus = require('http-status-codes')

module.exports = async (req, res) => {
  const { page } = req.params

  const { token } = req
  if (!page) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: 'Must provide a page number' })
  }

  if (!Number.isInteger(Number(page))) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: 'Page must be a valid integer' })
  }
  try {
    const { count } = await UserMovies.findAndCountAll({
      where: { userID: token.id }
    })
    if (!count) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'No movies in list' })
    }
    let limit = 15
    let totalPages = Math.ceil(count / limit) || 1
    let offset = limit * (page - 1)
    const movieData = await Movies.findAll({
      limit,
      offset,
      include: [MovieData, UserRating, UserMovies]
    })
    if (movieData) {
      return res.status(HttpStatus.OK).json({ movieData, totalPages })
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: 'Error getting movies' })
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
