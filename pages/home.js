import { omdb } from "../data/omdb"

const Home = () => {
    
    const registerEventListeners = () => {

    }

    const render = () => {
        const html = `<h1>Home</h1>`
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
    node.classList.add('home')

    return {
        get,
    }
}

export const home = Home()