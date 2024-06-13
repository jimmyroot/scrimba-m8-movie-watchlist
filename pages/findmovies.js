const db = await (async () => {
    const { db } = await import('../data/db')
    return db
})()

const omdb = await (async () => {
    const { omdb } = await import('../data/omdb')
    return omdb
})()

import { listMenu } from '../components/listmenu'

const Findmovies = () => {

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
            },
            add: async () => {
                listMenu.handleOpenMenu(lists)
                listMenu.positionMenu(e)
                // const listID = 'AhMw6h0rXq6MvL5OjuTM'
                // const { movieid } = e.target.dataset
                // const movie = currentSearch.find(movie => movie.imdbID === movieid)
                // if ( listID && movie ) {
                //     await db.addMovieToList(listID, movie)
                // }
            }
        }
        e.preventDefault()
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
        node.appendChild(listMenu.get())
    }

    const get = async user => {
        uid = user.uid
        lists = await db.getListsForUser(uid)
        refresh()
        return node
    }

    const getResults = async value => {
        try {
            if (!value) throw 'No search term supplied'
            const results = await omdb.searchMovies(value)
            currentSearch = results.Search
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
                    return `
                    <div>
                        <h3>${movie.Title}</h3>
                        <button data-type="add" data-movieid="${movie.imdbID}">Add</button>
                    </div>
                    `
                }
            ).join('')
        }
        return html
    }

    
    let uid = null
    let currentSearch = null
    let lists = null
    

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