// OMDB module, contains only two functions, search the database or
// retrieve a single movie by it's ID

import { OMDB_API_KEY } from './keys'

const OMDB_BASE_PATH = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&`
const OMDB_BASE_IMG_PATH = `https://img.omdbapi.com/?apikey=${OMDB_API_KEY}&`

const Omdb = async () => {
  // Search for movies, pass in the term. We also specify the type as
  // 'movie' otherwise the results are polluted with games, etc
  const searchMovies = async (term) => {
    const path = `${OMDB_BASE_PATH}s=${term}&type=movie`
    const headers = {
      method: 'GET',
    }

    const response = await fetch(path, headers)
    const results = await response.json()

    return results
  }

  // Get a single movie by it's ID
  const getMovieByIMDBId = async (id) => {
    const path = `${OMDB_BASE_PATH}i=${id}&type=movie`
    const headers = {
      method: 'GET',
    }

    const response = await fetch(path, headers)
    const result = await response.json()

    return result
  }

  return {
    searchMovies,
    getMovieByIMDBId,
  }
}

export const omdb = await Omdb()
