const ListMenu = () => {

    const registerEventListeners = () => {
    
    }

    const render = lists => {
        console.log(lists)
        let html = `
            <h3>Add to...</h3>
            ${renderLists(lists)}
        `
        return html
    }

    const renderLists = lists => {
        if (lists) {
            let html = lists.map(list => {
                const { title } = list.data
                return `
                    <p>${title}</p>
                `
            })
            return html
        }
        else {
            return ``
        }
    }

    const refresh = lists => {   
        node.innerHTML = render(lists)
    }

    const handleOpenMenu = lists => {
        refresh(lists)
        if (menuState != 1) {
            menuState = 1
            node.classList.add(active)
            document.addEventListener('click', handleCloseMenu, {capture: true})
            document.addEventListener('keyup', handleKeyUp)
        }
    }

    const handleKeyUp = e => {
        if (e.which === 27) closeMenu()
    }

    const handleCloseMenu = e => {
        const wasInside = document.querySelector('#context-menu').contains(e.target)
        console.log('fired')
        if (!wasInside) {
            closeMenu()
        }
    }

    const closeMenu = () => {
        if (menuState != 0) {
            menuState = 0
            node.classList.remove(active)
            document.removeEventListener('click', handleCloseMenu, true)
        }
    }

    const getPosition = e => {
        var posX = 0
        var posY = 0

        if (!e) {
            let e = window.Event
        }

        if (e.pageX || e.pageY) {
            posX = e.pageX
            posY = e.pageY
        }
        else if (e.clientX || e.clientY) {
            posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
            posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
        }

        return {
            x: posX,
            y: posY
        }
    }

    const positionMenu = e => {
        let posClick = getPosition(e)
        let posClickX = posClick.x
        let posClickY = posClick.y

        let menuWidth = node.offsetWidth + 4
        let menuHeight = node.offsetHeight + 4

        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        if (windowWidth - posClickX < menuWidth) {
            node.style.left = windowWidth - menuWidth + "px"
        }
        else {
            node.style.left = posClickX + "px"
        }

        if (windowHeight - posClickY < menuHeight) {
            node.style.top = windowHeight - menuHeight + "px"
        }
        else {
            node.style.top = posClickY + "px"
        }
    }

    const get = args => {
        refresh()
        return node
    }

    const node = document.createElement('div')
    node.id = 'context-menu'
    node.classList.add('context-menu')
    registerEventListeners()

    let menuState = 0
    let active = 'block'

    return {
        get,
        handleOpenMenu,
        positionMenu
    }
}

export const listMenu = ListMenu()