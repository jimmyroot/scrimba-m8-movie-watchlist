const Findmovies = () => {

    const name = 'findmovies'

    const registerEventListeners = () => {

    }

    const render = () => {
        const html = `<h1>Find Movies</h1>`
        return html
    }

    const refresh = () => {
        node.innerHTML = render()
    }

    const get = () => {
        refresh()
        return node
    }

    const node = document.createElement('main')
    node.classList.add('findmovies')

    return {
        get,
        name
    }
}

export const findmovies = Findmovies()