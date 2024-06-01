const Watchlist = () => {

    const name = 'watchlist'

    const registerEventListeners = () => {

    }

    const render = () => {
        const html = `<h1>My Watchlists</h1>`
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
    node.classList.add('watchlist')

    return {
        get,
        name
    }
}

export const watchlist = Watchlist()