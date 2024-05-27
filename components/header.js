const Header = () => {

    const registerEventListeners = () => {

    }

    const render = page => {
        const html = `
            <h2>Header</h2><p>${page.name}</p>
        `
        return html
    }

    const refresh = page => {
        node.innerHTML = render(page)
    }

    const get = page => {
        refresh(page)
        return node
    }

    const node = document.createElement('header')
    node.classList.add('header')

    return {
        get
    }
}

export const header = Header()