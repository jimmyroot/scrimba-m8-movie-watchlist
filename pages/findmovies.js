// Find movies page

import { omdb } from '../data/omdb'
import { db } from '../data/db'
import { listMenu } from '../components/listmenu'
import { modal } from '../components/modal'
import blankPosterUrl from '../assets/poster-placeholder.png'
import imgStarURL from '../assets/goldstar.svg'
import { shaveEls } from '../utils/utils'

const Findmovies = () => {

    // Event handler
    const handleClick = e => {
        const execute = {
            submit: () => {
                if (window.navigator.onLine === true) {
                    validateInputAndSubmitSearch()
                }
                else {
                    if (modal) modal.show(`It looks like you've gone offline! Please re-connect and try again.`)
                }
            },
            add: async () => {
                if (lists.length > 0) {
                    if (e.target.dataset.movieid) {
                        // Open context menu, pass the users lists and 
                        // the event target (the button that the user clicked)
                        // so we can keep it 'active' with a visual style
                        // until the menu is closed
                        listMenu.handleOpenMenu(lists, e.target)
                        // Position the context menu
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

    // Make sure the search field contains something and if yes,
    // add the spinner and submit the search
    const validateInputAndSubmitSearch = () => {
        const input = document.getElementById('find-movies-input')
        const value = input.value
        if (value) {
            node.querySelector('#page-results').classList.add('spinner', 'page__results--dimmed')
            const { value } = document.querySelector('#find-movies-input')
            getResults(value)
        }
        else {
            input.classList.add('warning')
        }
    }

    // Render the page
    const render = async () => {
        // Render results in the currentSearch object
        const resultsList = await renderResults(currentSearch)

        const html = `
            <header class="page__header">
                <div class="header__search">
                    <input class="search__input" type="text" id="find-movies-input" placeholder="e.g. 'The Matrix' or 'Blade Runner'"/>
                    <button class="search__btn" id="find-movies-btn" data-type="submit">
                        <i class='bx bx-search'></i>
                    </button>
                </div>
            </header>
            <section id="page-results" class="page__results">
                <ul class="movie__list">
                    ${resultsList}
                </ul>
            </section>
        `
        return html
    }

    // Render the results of current search, or a placeholder
    const renderResults = async currentSearch => {
        let html = ``

        if (currentSearch) {
            
            // Use promise.all to wait for all the calls to finish in the map loop
            html = await Promise.all(currentSearch.map(
                async movie => {

                    const fullMovieData = await omdb.getMovieByIMDBId(movie.imdbID)
                    const { Title, Year, Genre, Plot, Poster, imdbID } = fullMovieData

                    // Catch blank poster
                    const posterUrl = Poster === 'N/A' ? blankPosterUrl : Poster

                    // Set rating
                    let Rating = ''
                    if (fullMovieData.Ratings[0]) {
                        Rating = fullMovieData.Ratings[0].Value
                    }
                    
                    return `
                        <li class="movie__card">
                            <img class="movie__thumbnail" src="${posterUrl}" alt="Poster for the movie ${Title}">
                            <div class="movie__info">
                                <div class="movie__header">
                                    <h3 class="movie__title">${Title}</h3>
                                    <p><img class="movie__star" src="${imgStarURL}"><span>${Rating}</span></p>
                                </div>
                                <div class="movie__details">
                                    <span>${Year}</span>• 
                                    <span class="movie__genre">${Genre}</span>
                                </div>
                                <p class="movie__plot">${Plot}</p>
                                <div class="movie__btns">
                                    <button class="movie__btn movie__add-btn" data-type="add" data-movieid="${imdbID}" data-movietitle="${Title}"><i class='bx bx-add-to-queue bx-sm'></i> <span>Add to list</span></button>
                                </div>
                            </div>
                        </li>
                    `
                }
            )
        )}
        else {
            html = [`
                <li class="page__empty">
                    <p><i class='bx bx-movie-play bx-lg'></i></p>
                    <p>
                        Enter a movie title and hit search to get started!
                    </p>
                </li>
            `]
        }
        
        // Use spreadsyntax because promise.all returns an bunch of arrays
        // the contents of which we must extract, spread syntax is an 
        // amazingly succint way of doing so, I love it
        return [...html].join('')
    }

    // Submit the search results to the omdb module
    const getResults = async value => {
        try {
            if (!value) throw 'No search term supplied'
            const results = await omdb.searchMovies(value)
            currentSearch = results.Search
            await refresh()
        }
        catch(e) {
            console.error(`Unable to get results because: ${e}`)
        }
    }

    // No explanation needed
    const removeWarning = e => {
        if (e.target.classList.contains('warning')) e.target.classList.remove('warning')
    }
    
    // Refresh this page, we perform the main render and then
    // append the html for the context menu and modal. We also 
    // use requestAnimationFrame to synchronize the firing of the 
    // shaveEls function with the window re-paint (else it fires 
    // too early). The shave function is how the movie plot text
    // stays within 3 lines with the ellipsis appended
    const refresh = async () => {
        node.innerHTML = await render()
        node.appendChild(listMenu.get())
        node.appendChild(modal.get())

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                shaveEls()
            })
        })        
    }

    // A bit more setup to do in this module, when it's called
    // We configure a few parameters that are needed for the 
    // page's contents to render
    const get = async user => {
        uid = user.uid
        lists = await db.getListsForUser(uid)
        currentSearch = null
        await refresh()
        return node
    }

    let uid = null
    let currentSearch = null
    let lists = null
    
    const node = document.createElement('main')
    node.classList.add('main')

    // Add event listeners
    node.addEventListener('click', handleClick)
    node.addEventListener('input', removeWarning)
    node.addEventListener('keyup', e => {
        if (e.code === 'Enter') {
            validateInputAndSubmitSearch()
        }
    })

    // Shave on node resize, pretty much does what you'd think...
    // When the window is resized it makes sure a few elements'
    // text is trimmed to stay within boundaries
    const resizeObserver = new ResizeObserver(() => shaveEls())
    resizeObserver.observe(node)

    return {
        get
    }
}

export const findmovies = Findmovies()