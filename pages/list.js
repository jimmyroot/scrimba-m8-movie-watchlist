// List.js - renders all the movies in given list

import { db } from '../data/db'
import { shaveEls } from '../utils/utils'
import { modalWithConfirm } from '../components/modalwithconfirm'
import imgStarURL from '../assets/goldstar.svg'
import blankPosterUrl from '../assets/poster-placeholder.png'

const List = async () => {
  // Click handler, these are all self explanatory
  const handleClick = e => {
    const execute = {
      back: () => {
        e.preventDefault()
        history.go(-1)
      },
      removemovie: async () => {
        const { listPath } = e.target.closest('ul').dataset
        const { movieId, movieTitle } = e.target.dataset
        removeMovie(listPath, movieId, movieTitle)
      },
      togglewatched: async () => {
        const { listPath } = e.target.closest('ul').dataset
        const { movieId } = e.target.dataset
        await db.toggleMovieWatched(listPath, movieId)
      },
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
            <section id="page-section" class="page__results">
                <ul class="movie__list" data-list-path="${listPath}">
                    ${moviesHtml}
                </ul>
            </section>
        `

    return html
  }

  // Render movies, or a placeholder if none exist
  const renderMoviesForList = async (arrMovieIDs, listPath) => {
    const moviesFromList = await db.getMoviesFromList(listPath)

    let html = ``

    if (arrMovieIDs.length > 0) {
      // Get the movie data (this all comes from our own database, no more calls to OMDB)
      const movieData = await db.getMovies(arrMovieIDs)

      // Map over the movieData array
      html = movieData
        .map(movie => {
          const { Title, Runtime, Genre, Plot, Poster, imdbID } = movie
          const currentMovieFromUsersList = moviesFromList.find(
            movieFromList => movieFromList.imdbID === movie.imdbID
          )

          // Catch blank poster and set appropriate URL
          const posterUrl = Poster === 'N/A' ? blankPosterUrl : Poster

          // Set the rating if it exists else leave as NA
          let Rating = 'N/A'
          if (movie.Ratings[0]) {
            Rating = movie.Ratings[0].Value
          }

          // Render the buttons, this could be done on the fly inside the main render but
          // feels nicer sorting the buttons first then adding them to the rest of the
          // html
          const watched = currentMovieFromUsersList.watched

          const watchedBtn = `
                    <button class="movie__btn movie__btn-watched ${watched ? 'movie__btn--active' : ''}" data-type="togglewatched" data-movie-id="${imdbID}">
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
                    <a class="movie__btn movie__btn-a movie__btn-imdb" href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank">
                        <i class='bx bx-link-external'></i>
                        <span>IMDb</span>
                    </a>
                `
          // Return the html for this movie
          return `    
                        <li class="movie__card">
                            <img class="movie__thumbnail" src="${posterUrl}" alt="Poster for the movie ${Title}">
                            <div class="movie__info">
                                <div class="movie__header">
                                    <h3 class="movie__title">${Title}</h3>
                                    <p><img class="movie__star" src="${imgStarURL}"><span>${Rating}</span></p>
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
    } else {
      html += `
                <li class="page__empty">
                    <p><i class='bx bx-confused bx-lg'></i></p>
                    <p>
                       This list needs movies! Head over to 'Find Movies' to add some.
                    </p>
                </li>`
    }

    return html
  }

  // Remove a single movie, called from handleClick
  const removeMovie = async (listPath, movieId, movieTitle) => {
    if (listPath && movieId) {
      const result =
        (await modalWithConfirm.show(`Really remove '${movieTitle}'?`)) ===
        'yes'
          ? true
          : false
      if (result) await db.removeMovieFromList(listPath, movieId)
    }
  }

  // This function ultimately drives this page, it initializes an 'onSnapshot' listener
  // that fires every time thee data in the references document (a watchlist) changes
  // In this way every time we remove a movie, or toggle the watched status, it
  // triggers a re-render of the page
  const listenForChangesAndRefreshList = async listPath => {
    const listDoc = db.doc(db.db, listPath)

    unsubscribeFromListListener = db.onSnapshot(listDoc, async docSnapshot => {
      if (docSnapshot.exists()) {
        const { title, movies } = docSnapshot.data()
        const arrMovieIDs = Object.values(movies).map(movie => {
          return movie.imdbID
        })
        await refresh(listPath, title, arrMovieIDs)
      }
    })
  }

  // Similar to find movies, but we're getting our list of movies from
  // the referenced list rather than the 'currentSearch' results
  const refresh = async (listPath, title, arrMovieIDs) => {
    const html = await render(listPath, title, arrMovieIDs)
    node.innerHTML = html
    node.querySelector('#page-section').after(modalWithConfirm.get())

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        shaveEls()
      })
    })
  }

  // The get function is slightly different from the other modules, here
  // we make sure that there is an instance of our snapshot listener
  // running. To make sure we don't add multiple listeners, we assign the
  // result to a variable in this module, then check it before we
  // re-initialize ('get' will be called each time the user navigates to a list)
  const get = async (user, listPath) => {
    node.innerHTML = ``

    if (listPath) {
      if (unsubscribeFromListListener === null) {
        await listenForChangesAndRefreshList(listPath)
      } else {
        unsubscribeFromListListener()
        await listenForChangesAndRefreshList(listPath)
      }
    }

    return node
  }

  // Init module
  let unsubscribeFromListListener = null

  const node = document.createElement('main')
  node.classList.add('main')

  // Event listeners
  node.addEventListener('click', handleClick)

  // Fire the shave function whenever the node changes size
  const resizeObserver = new ResizeObserver(entries => shaveEls())
  resizeObserver.observe(node)

  return {
    get,
  }
}

export const list = await List()
