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
                const { list } = e.target.closest('ul').dataset
                const { movieid } = e.target.dataset
                if ( list && movieid) await db.removeMovieFromList(list, movieid)
            }
        }
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const render = async (listPath, title, arrMovieIDs) => {

        let html = `
            <a href="#" data-type="back">Back</a>
            <h1>${title}</h1>
            <ul data-list="${listPath}">
        `

        // refactor -> 'if (moviesArray.length > 0) { do stuff }
        try {
            const movieData = await db.getMovies(arrMovieIDs)

            const moviesHtml = movieData.map(movie => {
                return `
                    <li>
                        <h4>${movie.Title}</h4>
                        <p>${movie.imdbRating}</p>
                        <p>${movie.Plot}</p>
                        <button data-type="removemovie" data-movieid="${movie.imdbID}">Remove</button>
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

    const listenForChangesAndRefreshList = async (listPath) => {
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