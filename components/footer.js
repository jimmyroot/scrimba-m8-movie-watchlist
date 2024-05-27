const Footer = () => {

    const registerEventListeners = () => {

    }

    const render = () => {
        const html = `<h2>Footer</h2>`
        return html
    }

    const refresh = () => {
        node.innerHTML = render()
    }

    const get = () => {
        refresh()
        return node
    }

    const node = document.createElement('footer')
    node.classList.add('footer')

    return {
        get
    }
}

export const footer = Footer()