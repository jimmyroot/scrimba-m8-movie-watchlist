const Footer = () => {

    const registerEventListeners = () => {

    }

    const render = () => {
        const html = `
            <p>Reel Talk</p>
            <p>Copyright Jimmy ©2024</p>
        `
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