import { omdb } from '../data/omdb'
import { db } from '../data/db'
import { listMenu } from '../components/listmenu'
import { modal } from '../components/modal'

const Findmovies = () => {

    const handleClick = e => {
        const execute = {
            submit: () => {
                node.querySelector('#page-results').classList.add('spinner', 'page__results--dimmed')
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
        const resultsList = await renderResults(currentSearch)

        const html = `
            <header class="page__header">
                <div class="header__search">
                    <input class="search__input" type="text" id="find-movies-input" placeholder="e.g. 'The Matrix' or 'Keanu Reeves'"/>
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
                        <li class="movie__card">
                            <img class="movie__thumbnail" src="${Poster}" alt="Poster for the movie ${Title}">
                            <div class="movie__info">
                                <div class="movie__header">
                                    <h3 class="movie__title">${Title}</h3>
                                    <p>${Rating}</p>
                                </div>
                                <div class="movie__details">
                                    <p>${Runtime}</p>       
                                    <p class="movie__genre">${Genre}</p>
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
        
        return [...html].join('')
    }

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

    const shaveEls = () => {
        const titles = document.querySelectorAll('.movie__title')
        const plots = document.querySelectorAll('.movie__plot')
        const genres = document.querySelectorAll('.movie__genre')
        
        if (titles.length > 0 && plots.length > 0 && genres.length > 0) {
            shave(titles, 50)
            shave(plots, 70)
            shave(genres, 20)
        }
    }
    
    const refresh = async () => {
        node.innerHTML = await render()
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

    let uid = null
    let currentSearch = null
    let lists = null
    
    const node = document.createElement('main')
    node.classList.add('main')
    node.addEventListener('click', handleClick)

    // Shave on node resize
    const resizeObserver = new ResizeObserver(entries => shaveEls())
    resizeObserver.observe(node)

    // Shave on node update
    const mutationObserver = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                setTimeout(shaveEls, 60)
            }
        }
    })

    mutationObserver.observe(node, {attributes: false, childList: true, subtree: false})

    return {
        get
    }
}

export const findmovies = Findmovies()