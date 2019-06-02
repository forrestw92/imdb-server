const { UserMovies, UserRating } = require('../../../models/')
const HttpStatus = require('http-status-codes')

module.exports = async (req, res) => {
  const { rating, movieID } = req.body
  const { token } = req
  try {
    const isValidMovie = await UserMovies.findOne({
      where: { movieID, userID: token.id }
    })
    if (!isValidMovie) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: 'Movie does not exists' })
    }
    const hasRated = await UserRating.findOne({
      where: { movieID, userID: token.id }
    })
    if (!hasRated) {
      const newRating = await UserRating.create({
        rating,
        movieID,
        userID: token.id
      })
      if (newRating) {
        return res
          .status(HttpStatus.OK)
          .json({ message: 'Successfully rated movie' })
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Error rating movie ' })
    }
    if (hasRated.rating === Number(rating)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Rating already set at that value' })
    }
    const updateRating = await UserRating.update(
      { rating },
      { where: { movieID, userID: token.id } }
    )
    if (updateRating) {
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Successfully updated rating' })
    }
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error updating rating' })
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
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Error' })
  }
}
