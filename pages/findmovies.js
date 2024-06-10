const db = await (async () => {
    const { db } = await import('../data/db')
    return db
})()

const omdb = await (async () => {
    const { omdb } = await import('../data/omdb')
    return omdb
})()

const Findmovies = () => {

    const name = 'findmovies'
    let currentSearch = null

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
    }

    const handleClick = e => {
        const execute = {
            submit: () => {
                const { value } = document.querySelector('#find-movies-input')
                getResults(value)
            }
        }
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const render = () => {
        const html = `
            <h1>Find Movies</h1>
            <input type="text" id="find-movies-input" />
            <button id="find-movies-btn" data-type="submit">Search</button>
            ${renderResults(currentSearch)}
            `
        return html
    }

    const refresh = () => {
        node.innerHTML = render()
    }

    const get = () => {
        refresh()
        return node
    }

    const getResults = async value => {
        try {
            if (!value) throw 'No search term supplied'
            const results = await omdb.searchMovies(value)
            currentSearch = results.Search
            // console.log(currentSearch)
            refresh()
        }
        catch(e) {
            console.error(`Unable to get results because: ${e}`)
        }
    }

    const renderResults = currentSearch => {
        let html = ``

        if (currentSearch) {
            html = currentSearch.map(
                movie => {
                    // console.log('')
                    return `
                    <div>
                        <h3>${movie.Title}</h3>
                    </div>
                    `
                }

            ).join('')
        }

        return html
    }

    const node = document.createElement('main')
    node.classList.add('findmovies')
    registerEventListeners()

    // const test = async searchTerm => {
    //     const results = await omdb.searchMovies(searchTerm)
    //     db.addMovieToList('Qf1eI5H57wkXvhYZksOn', results.Search[0])

    //     // db.removeMovieFromList('lWTlKEI3WEd084YkfKTL', results.Search[0])
    // }
    // // console.log(results)
    
    // test('Fast Furious')

    return {
        get,
        name
    }
}

export const findmovies = Findmovies()