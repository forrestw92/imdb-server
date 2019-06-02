const got = require('got')
const cheerio = require('cheerio')
module.exports = class Scraper {
  constructor (movieID) {
    this.data = {
      movieID,
      name: undefined,
      poster: undefined,
      thumbnail: undefined,
      year: undefined,
      storyline: undefined,
      taglines: undefined,
      genres: undefined,
      releaseDate: undefined,
      runtime: undefined,
      rating: undefined,
      ratingCount: undefined,
      mpaaRating: undefined
      /**
       * Add more fields that you would like to insert.
       * Keep it the same in models and migrations
       */
    }
    this.scrape = this.scrape.bind(this)
    this.funcs = []

    this.funcs.push(this.getName.bind(this))
    this.funcs.push(this.getGenres.bind(this))
    this.funcs.push(this.getImages.bind(this))
    this.funcs.push(this.getMPAARating.bind(this))
    this.funcs.push(this.getRating.bind(this))
    this.funcs.push(this.getRatingCount.bind(this))
    this.funcs.push(this.getStoryline.bind(this))
    this.funcs.push(this.getTaglines.bind(this))
    this.funcs.push(this.getRuntime.bind(this))
    this.funcs.push(this.getYear.bind(this))
    /**
     * Add your new scrape function here like above
     */
  }

  scrape () {
    return got(`https://www.imdb.com/title/${this.data.movieID}/`)
      .then(({ body }) => {
        const $ = cheerio.load(body)
        /**
         * Loops each get data func and passes cheerio instance.
         */
        this.funcs.forEach(f => f($))
        return this.data
      })
      .catch(({ statusCode }) => {
        if (statusCode === 404) {
          return { error: 'Movie id does not exists', statusCode }
        }
        return { error: 'Error scraping movie' }
      })
  }

  /**
   * Get movie name
   */
  getName ($) {
    this.data.name = $('.title_wrapper h1')
      .first()
      .contents()
      .filter(function () {
        return this.type === 'text'
      })
      .text()
      .trim()
  }

  /**
   * Get movie mpaa rating
   */
  getMPAARating ($) {
    this.data.mpaaRating = $('.title_wrapper .subtext')
      .first()
      .contents()
      .filter(function () {
        return this.type === 'text'
      })
      .text()
      .replace(/\s+/g, '')
      .replace(/,/g, '')
      .trim()
  }

  /**
   * Get movie genres
   */
  getGenres ($) {
    this.data.genres = $('.title_wrapper .subtext a')
      .map((i, el) => {
        const genre = $(el).text()
        const title = $(el).attr('title')
        if (!title) {
          return genre
        } else {
          let releaseDate = new Date(genre)
          releaseDate.setHours(0, 0, 0)
          this.data.releaseDate = releaseDate.toISOString()
        }
      })
      .get()
  }

  /**
   * Get movie taglines
   */
  getTaglines ($) {
    this.data.taglines = $('.txt-block:contains("Taglines:")')
      .first()
      .contents()
      .filter(function () {
        return this.type === 'text'
      })
      .text()
      .trim()
  }

  /**
   * Get movie storyline
   */
  getStoryline ($) {
    this.data.storyline = $('.inline.canwrap p span')
      .text()
      .trim()
  }

  /**
   * Get movie rating count
   */
  getRatingCount ($) {
    this.data.ratingCount = Number(
      $('span[itemprop=ratingCount]')
        .text()
        .replace(/[^0-9\.]+/g, '')
    )
  }

  /**
   * Get movie rating
   */
  getRating ($) {
    this.data.rating = Number($('span[itemprop=ratingValue]').text())
  }

  /**
   * Get Movie poster and thumbnail
   */
  getImages ($) {
    const thumbnail = $('.poster img').attr('src')
    this.data.thumbnail = thumbnail
    this.data.poster = thumbnail.split('._V1')[0] + '.jpeg'
  }

  /**
   * Get movie runtime in minutes
   */
  getRuntime ($) {
    this.data.runtime = Number(
      $('time')
        .eq(1)
        .text()
        .replace(' min', '')
    )
  }

  /**
   * Get Movie Name
   */
  getYear ($) {
    this.data.year = $('span#titleYear a ').text()
  }

  /**
   * Add any more getting functions down here. Dont forget to pass $ as a param
   */
}
