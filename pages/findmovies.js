const db = await (async () => {
    const { db } = await import('../data/db')
    return db
})()

const omdb = await (async () => {
    const { omdb } = await import('../data/omdb')
    return omdb
})()

import { listMenu } from '../components/listmenu'
import { modal } from '../components/modal'

const Findmovies = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })

        const resizeObserver = new ResizeObserver(entries => {

            // REFACTOR TO DO THE SHAVING HERE
            shavePlotPs()
            shaveTitles()
        })

        resizeObserver.observe(node)
    }

    const handleClick = e => {
        const execute = {
            submit: () => {
                const { value } = document.querySelector('#find-movies-input')
                getResults(value)
            },
            add: async () => {
                if (lists.length > 0) {
                    if (e.target.dataset.movieid) {
                        listMenu.handleOpenMenu(lists, e.target)
                        listMenu.positionMenu(e)
                    }
                }
                else {
                    modal.show(`You don't have any lists yet! To get started, go to My Lists and create a list or two.`)
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
        shavePlotPs()
        node.appendChild(listMenu.get())
        node.appendChild(modal.get())
    }

    const get = async user => {
        uid = user.uid
        lists = await db.getListsForUser(uid)
        currentSearch = null
        await refresh()
        return node
    }

    const shaveTitles = () => {
        const elsToShave = node.querySelectorAll('.movie__title')
        shave(elsToShave, 50)
    }

    const shavePlotPs = () => {
        console.log('firing')
        const elsToShave = node.querySelectorAll('.is__truncated')
        shave(elsToShave, 80)
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
                    
                    return `
                        <div class="movie__card">
                            <img class="movie__thumbnail" src="${Poster}" alt="Poster for the movie ${Title}">
                            <div class="movie__info">
                                <div class="movie__header">
                                    <h3 class="movie__title">${Title}</h3>
                                    <p>${Rating}</p>
                                </div>
                                <div class="movie__details">
                                    <p>${Runtime}</p>       
                                    <p>${Genre}</p>
                                </div>
                                <p class="movie__plot is__truncated">${Plot}</p>
                                <div class="movie__buttons">
                                    <button class="movie__add-btn" data-type="add" data-movieid="${imdbID}" data-movietitle="${Title}"><i class='bx bx-add-to-queue bx-sm'></i> <span>Add to list</span></button>
                                </div>
                            </div>
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
        get
    }
}

export const findmovies = Findmovies()