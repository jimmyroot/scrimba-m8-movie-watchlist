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

        let html = `
            <a href="#" data-type="back">Back</a>
            <h1>${title}</h1>
        `

        try {
            const movieData = await db.getMovies(moviesArray)

            const moviesHtml = movieData.map(movie => {
                return `
                    <div>
                        <h4>${movie.Title}</h4>
                        <p>${movie.imdbRating}</p>
                        <p>${movie.Plot}</p>
                    </div>
                `
            })
    
            html += `
                ${moviesHtml}
            `
        }
        catch {
            html += `<p>You didn't add anything to this list yet!</p>`
        }

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

    return {
        get
    }
}

export const list = List()