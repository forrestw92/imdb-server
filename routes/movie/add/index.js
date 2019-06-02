const got = require('got')
const cheerio = require('cheerio')
const { Movies, UserMovies, MovieData } = require('../../../models/')
const Scraper = require('../../../Scraper')
const HttpStatus = require('http-status-codes')

module.exports = async (req, res) => {
  const { movieID } = req.body
  const { token } = req

  try {
    const findUserMovie = await UserMovies.findOne({
      where: { movieID, userID: token.id }
    })
    if (!findUserMovie) {
      const findMovie = await Movies.findOne({ where: { movieID } })
      if (!findMovie) {
        const scraper = new Scraper(movieID)
        const {
          name,
          poster,
          year,
          storyline,
          thumbnail,
          taglines,
          genres,
          releaseDate,
          runtime,
          rating,
          ratingCount,
          mpaaRating,
          error,
          statusCode
          /**
           * Don't forget to add the new data vars here
           */
        } = await scraper.scrape()
        if (error) {
          if (statusCode) {
            return res.status(HttpStatus.NOT_FOUND).json({ error })
          }
          return res.status(HttpStatus.BAD_REQUEST).json({ error })
        }
        const addMovie = await Movies.create({
          movieID,
          name,
          poster,
          thumbnail,
          year,
          MovieData
        })
        const addMovieDetails = await MovieData.create({
          storyline,
          taglines,
          genres,
          releaseDate,
          runtime,
          movieID,
          rating,
          ratingCount,
          mpaaRating
          /**
           * Add deconstructed here
           */
        })
        if (addMovie && addMovieDetails) {
          const addUserMovie = await UserMovies.create({
            movieID,
            userID: token.id
          })
          if (addUserMovie) {
            return res
              .status(HttpStatus.CREATED)
              .json({ message: 'Added movie to list.' })
          }
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ error: 'Error adding movie to list' })
        }
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'Error adding movie to db list' })
      }
      const addUserMovie = await UserMovies.create({
        movieID,
        userID: token.id
      })
      if (addUserMovie) {
        return res
          .status(HttpStatus.CREATED)
          .json({ message: 'Added movie to list.' })
      }
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Movie already in list' })
    }
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
