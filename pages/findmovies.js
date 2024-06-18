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
                const { movieid } = e.target.dataset
                if (movieid) {
                    listMenu.handleOpenMenu(lists, movieid)
                    listMenu.positionMenu(e)
                }
            }
        }
        e.preventDefault()
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const render = async () => {
        const html = `
            <header class="page__header">
                <div class="header__search">
                    <input class="search__input" type="text" id="find-movies-input" placeholder="e.g. 'The Matrix' or 'Keanu Reeves'"/>
                    <button class="search__btn" id="find-movies-btn" data-type="submit">
                        <i class='bx bx-search'></i>
                    </button>
                </div>
            </header>
            <section class="page__results">
                ${await renderResults(currentSearch)}
            </section>
            `
        return html
    }

    const refresh = async () => {
        node.innerHTML = await render()
        node.appendChild(listMenu.get())
    }

    const get = async user => {
        uid = user.uid
        lists = await db.getListsForUser(uid)
        await refresh()
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

    const renderResults = async currentSearch => {
        let html = ``

        if (currentSearch) {
            html = await Promise.all(currentSearch.map(
                async movie => {
                    const fullMovieData = await omdb.getMovieByIMDBId(movie.imdbID)
                    const { Title, Runtime, Genre, Plot, Poster, imdbID } = fullMovieData
                    let Rating = ''
                    if (fullMovieData.Ratings[0]) {
                        Rating = fullMovieData.Ratings[0].Value
                    }
                    // let Rating = ''
                    // if (Boolean(fullMovieData.Ratings[0])) {
                    //     Rating = fullMovieData.Ratings[0].value
                    // }
                    return `
                        <div>
                            <img src="${Poster}" alt="The poster for the movie '${Title}'">
                            <h3>${Title}</h3>
                            <p>${Rating}</p>
                            <p>${Runtime}</p>
                            <p>${Genre}</p>
                            <p>${Plot}</p>
                            <button data-type="add" data-movieid="${imdbID}">Add</button>
                        </div>
                    `
                }
            )
        )}
        else {
            console.log('Nothing to do, currentSearch is empty')
        }
        
        return [...html].join('')
    }

    
    let uid = null
    let currentSearch = null
    let lists = null
    
    const node = document.createElement('main')
    node.classList.add('findmovies')


    registerEventListeners()

    return {
        get,
        name
    }
}

export const findmovies = Findmovies()