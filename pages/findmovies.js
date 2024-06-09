const db = await (async () => {
    const { db } = await import('../data/db')
    return db
})()

const omdb = await (async () => {
    const { omdb } = await import('../data/omdb')
    return omdb
})()

const Findmovies = async () => {

    const name = 'findmovies'

    const registerEventListeners = () => {

    }

    const render = () => {
        const html = `<h1>Find Movies</h1>`
        return html
    }

    const refresh = () => {
        node.innerHTML = render()
    }

    const get = () => {
        refresh()
        return node
    }

    const node = document.createElement('main')
    node.classList.add('findmovies')

    const results = await omdb.searchMovies('Brazil')
    // db.addMovie(results.Search[0])
    db.addMovieToList('lWTlKEI3WEd084YkfKTL', results.Search[0])
    // db.removeMovieFromList('lWTlKEI3WEd084YkfKTL', results.Search[0])

    return {
        get,
        name
    }
}

export const findmovies = Findmovies()