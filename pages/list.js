import { auth } from '../data/auth'
import { router } from '../pages/router'

const db = await (async () => {
    const { db } = await import('../data/db')
    return db
})()

const List = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
    }

    const handleClick = e => {
        const execute = {
            back: () => {
                router.navigate('/mylists')
            }
        }
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const render = async (user, listPath) => {

        const list = await db.getListByPath(listPath)
        const { title, movies } = list
        
        const moviesArray = Object.values(movies).map(movie => {
            return movie.imdbID
        })

        const movieData = await db.getMovies(moviesArray)

        const moviesHtml = movieData.map(movie => {
            console.log(movie)
            return `
                <div>
                    <h4>${movie.Title}</h4>
                    <p>${movie.imdbRating}</p>
                    <p>${movie.Plot}</p>
                </div>
            `
        })

        console.log(movieData)

        const html = `
            <a href="#" data-type="back">Back</a>
            <h1>${title}</h1>
            ${moviesHtml}
        `
        return html
    }

    const refresh = async (user, listPath) => {
        node.innerHTML = await render(user, listPath)
    }

    const get = async (user, listPath) => {
        await refresh(user, listPath)
        return node
    }

    const node = document.createElement('main')
    node.classList.add('list')
    registerEventListeners()

    db.removeList('9fOrwXR4Iyfd9HUVeuSc')

    return {
        get
    }
}

export const list = List()