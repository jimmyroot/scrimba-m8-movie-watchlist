const OMDB_API_KEY = 'a84e34ea'
const OMDB_BASE_PATH = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&`
const OMDB_BASE_IMG_PATH = `http://img.omdbapi.com/?apikey=${OMDB_API_KEY}&`

const Omdb = async () => {

    const searchMovies = async term => {
        const path = `${OMDB_BASE_PATH}s=${term}&type=movie`
        const headers = {
            'method': 'GET'
        }

        const response = await fetch(path, headers)
        const results = await response.json()
        
        return results
    }

    const getMovieByIMDBId = async id => {
        const path = `${OMDB_BASE_PATH}i=${id}&type=movie`
        const headers = {
            'method': 'GET'
        }

        const response = await fetch(path, headers)
        const result = await response.json()

        return result
    }

    // const getPosterByIMDBId = async id => {
    //     const path = `${OMDB_BASE_IMG_PATH}`
    // }
    
    // const movies = await searchMovies('star wars')
    // console.log(movies.Search[0])

    // console.log(await getMovieByIMDBId('tt0076759'))

    return {
        searchMovies,
        getMovieByIMDBId,
    }
}

export const omdb = await Omdb()