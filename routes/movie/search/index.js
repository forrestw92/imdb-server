const got = require('got')
const HttpStatus = require('http-status-codes')

/**
 * Gets correct url for movie search suggestions.
 * @param searchTerm
 * @returns {string} - Correct api url
 */
function buildAPIUrl (searchTerm) {
  // suggestion/{start_letter_of_search_term}/{search_term}.json
  return `https://v2.sg.media-imdb.com/suggestion/${searchTerm.charAt(
    0
  )}/${searchTerm}.json`
}
module.exports = async (req, res) => {
  const { searchTerm } = req.params
  if (!searchTerm) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: 'Must provide a search query' })
  }
  try {
    const { body } = await got(buildAPIUrl(searchTerm))
    res.status(HttpStatus.OK).json(JSON.parse(body))
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Error' })
  }
}
