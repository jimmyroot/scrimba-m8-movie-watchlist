import { auth } from '../data/auth'
import { router } from '../pages/router'

const db = await (async () => {
    const { db } = await import('../data/db')
    return db
})()

const List = async () => {

    const handleClick = e => {
        const execute = {
            back: () => {
                router.navigate('/mylists')
            },
            removemovie: async () => {
                const { listPath } = e.target.closest('ul').dataset
                const { movieid } = e.target.dataset
                if ( listPath && movieid) await db.removeMovieFromList(listPath, movieid)
            },
            togglewatched: async () => {
                const { listpath } = e.target.closest('ul').dataset
                const { movieid } = e.target.dataset
                console.log(listpath, movieid)
                await db.toggleMovieWatched(listpath, movieid)
            }
        }
        e.preventDefault()
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const render = async (listPath, title, arrMovieIDs) => {
        // Get the movies from the list we're rendering, this contains 'watched' status
        const moviesFromList = await db.getMoviesFromList(listPath)

        let html = `
            <header class="page__header">
                <div class="header__list">
                    <a class="header__btn-back" href="#" data-type="back"><i class='bx bx-arrow-back bx-sm'></i></a>
                    <h2 class="header__list-title">${title}</h2>
                </div>
            </header>
            
            <ul data-listpath="${listPath}">
        `

        // refactor -> 'if (moviesArray.length > 0) { do stuff }
        try {
            const movieData = await db.getMovies(arrMovieIDs)

            const moviesHtml = movieData.map(movie => {
                const currentMovieFromUsersList = moviesFromList.find(movieFromList => movieFromList.imdbID === movie.imdbID)
                const watched = currentMovieFromUsersList.watched ? 'Watched' : 'Not Watched'
                return `
                    <li>
                        <h4>${movie.Title}</h4>
                        <p>${movie.imdbRating}</p>
                        <p>${movie.Plot}</p>
                        <button data-type="removemovie" data-movieid="${movie.imdbID}">Remove</button>
                        <button data-type="togglewatched" data-movieid="${movie.imdbID}">${watched}</button>
                    </li>
                `
            }).join('')
    
            html += `
                ${moviesHtml}
                </ul>
            `
        }
        catch {
            html += `<p>You didn't add anything to this list yet!</p>`
        }

        return html
    }

    const refresh = async (listPath, title, arrMovieIDs) => {
        const html = await render(listPath, title, arrMovieIDs)
        node.innerHTML = html
    }

    const listenForChangesAndRefreshList = async listPath => {
        const listDoc = db.doc(db.db, listPath)

        unsubscribeFromListListener = db.onSnapshot(listDoc, docSnapshot => {
            if (!docSnapshot.empty) {
                const { title, movies } = docSnapshot.data()
                const arrMovieIDs = Object.values(movies).map(movie => {
                    return movie.imdbID
                })
                refresh(listPath, title, arrMovieIDs)
            }
        })
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
    node.classList.add('list')
    node.addEventListener('click', handleClick)
    let unsubscribeFromListListener = null

    return {
        get
    }
}

export const list = await List()