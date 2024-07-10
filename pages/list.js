import { auth } from '../data/auth'
import { router } from '../pages/router'
import { modalWithConfirm } from '../components/modalwithconfirm'

const db = await (async () => {
    const { db } = await import('../data/db')
    return db
})()

const List = async () => {

    const handleClick = e => {
        const execute = {
            back: () => {
                e.preventDefault()
                router.navigate('/mylists')
            },
            removemovie: async () => {
                const { listPath } = e.target.closest('ul').dataset
                const { movieId, movieTitle } = e.target.dataset

                if (listPath && movieId) {
                    const result = (await modalWithConfirm.show(`Really remove '${movieTitle}'?`)) === 'yes' ? true : false
                    if (result) await db.removeMovieFromList(listPath, movieId)
                }
            },
            togglewatched: async () => {
                const { listPath } = e.target.closest('ul').dataset
                const { movieId } = e.target.dataset
                console.log(listPath, movieId)
                await db.toggleMovieWatched(listPath, movieId)
            }
        }
        
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const render = async (listPath, title, arrMovieIDs) => {
        // Get the movies from the list we're rendering, this contains 'watched' status
        const moviesHtml = await renderMoviesForList(arrMovieIDs, listPath)

        let html = `
            <header class="page__header">
                <div class="header__list">
                    <a class="header__btn-back" href="#" data-type="back"><i class='bx bx-arrow-back bx-sm'></i></a>
                    <h2 class="header__list-title">${title}</h2>
                </div>
            </header>
            <section class="page__results">
                <ul class="movie__list" data-list-path="${listPath}">
                    ${moviesHtml}
                </ul>
            </section>
        `
        
        return html
    }

    const renderMoviesForList = async (arrMovieIDs, listPath) => {
        const moviesFromList = await db.getMoviesFromList(listPath)
        
        let html = ``

        if (arrMovieIDs.length > 0) {
            const movieData = await db.getMovies(arrMovieIDs)

            html = movieData.map(movie => {
                const { Title, Runtime, Genre, Plot, Poster, imdbID } = movie
                const currentMovieFromUsersList = moviesFromList.find(movieFromList => movieFromList.imdbID === movie.imdbID)
                
                // Set the rating
                let Rating = 'N/A'
                if (movie.Ratings[0]) {
                    Rating = movie.Ratings[0].Value
                }

                // Set up the buttons
                const watched = currentMovieFromUsersList.watched

                const watchedBtn = `
                    <button class="movie__btn ${watched ? 'movie__btn--active' : ''}" data-type="togglewatched" data-movie-id="${imdbID}">
                            ${watched ? `<i class='bx bxs-checkbox-checked'></i>` : `<i class='bx bx-checkbox'></i>`}
                            <span>Watched</span>
                    </button>
                `
                
                const removeBtn = `
                    <button class="movie__btn movie__remove-btn" data-type="removemovie" data-movie-id="${imdbID}" data-movie-title="${Title}">
                        <i class='bx bx-x' ></i>
                        <span>Remove</span>
                    </button>
                `

                const imdbLink = `
                    <a class="movie__btn movie__btn-a" href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank">
                        <i class='bx bx-link-external'></i>
                        <span>View at IMDb</span>
                    </a>
                `

                return `    
                        <li class="movie__card">
                            <img class="movie__thumbnail" src="${Poster}" alt="Poster for the movie ${Title}">
                            <div class="movie__info">
                                <div class="movie__header">
                                    <h3 class="movie__title">${Title}</h3>
                                    <p><img class="movie__star" src="/assets/goldstar.svg"><span>${Rating}</span></p>
                                </div>
                                <div class="movie__details">
                                    <p>${Runtime}</p>       
                                    <p>${Genre}</p>
                                </div>
                                <p class="movie__plot">${Plot}</p>
                                <div class="movie__btns">
                                    ${watchedBtn}
                                    ${removeBtn}
                                    ${imdbLink}
                                </div>
                            </div>
                        </li>
                `
            })
            .join('')
        }
        else {
            html += `
                <li class="page__empty">
                    <p><i class='bx bx-confused bx-lg'></i></p>
                    <p>
                       This list needs movies! Head over to 'Find Movies' to add one, or ten!
                    </p>
                </li>`
        }

        return html
    }

    const refresh = async (listPath, title, arrMovieIDs) => {
        const html = await render(listPath, title, arrMovieIDs)
        node.innerHTML = html
        node.appendChild(modalWithConfirm.get())
    }

    const listenForChangesAndRefreshList = async listPath => {
        const listDoc = db.doc(db.db, listPath)

        unsubscribeFromListListener = db.onSnapshot(listDoc, async docSnapshot => {
            if (!docSnapshot.empty) {
                const { title, movies } = docSnapshot.data()
                const arrMovieIDs = Object.values(movies).map(movie => {
                    return movie.imdbID
                })
                await refresh(listPath, title, arrMovieIDs)
                shaveEls()
            }
        })
    }

    const shaveEls = () => {
        const title = node.querySelectorAll('.movie__title')
        const plot = node.querySelectorAll('.movie__plot')
        shave(title, 50)
        shave(plot, 80)
    }

    const get = async (user, listPath) => {
        node.innerHTML = ``

        if (listPath) {
            if (unsubscribeFromListListener === null) {
                await listenForChangesAndRefreshList(listPath)
            }
            else {
                unsubscribeFromListListener()
                await listenForChangesAndRefreshList(listPath)
            }
        }
        
        return node
    }

    const node = document.createElement('main')
    node.classList.add('main')
    node.addEventListener('click', handleClick)
    let unsubscribeFromListListener = null

    const resizeObserver = new ResizeObserver(entries => {
        shaveEls()
    })

    resizeObserver.observe(node)

    return {
        get
    }
}

export const list = await List()