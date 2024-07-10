const db = await (async () => {
    const { db } = await import('../data/db')
    return db
})()

import { modal } from '../components/modal'

const ListMenu = () => {

    let btnThatOpenedTheMenu = null
    let movieCardEl = null

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
    }

    const handleClick = e => {
        const execute = {
            addmovie: async () => {
                const { list, movieid } = e.target.dataset
                const { movietitle } = e.target.closest('ul').dataset
                closeMenu()
                if (list) {
                    movieCardEl.classList.add('spinner','movie__card--dimmed')
                    await db.addMovieToList(list, movieid, modal, movietitle)
                    movieCardEl.classList.remove('spinner','movie__card--dimmed')
                }
            }
        }
        e.preventDefault()
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const render = (lists, movieid, movietitle) => {
        let html = `
            <ul class="context-menu__watchlists" data-movietitle="${movietitle}">
            ${renderLists(lists, movieid)}
            </ul>
        `
        
        return html
    }

    const renderLists = (lists, movieid) => {
        if (lists) {
            let html = lists.map(list => {
                const { title } = list.data
                const { docPath } = list

                return `
                    <li class="context-menu__list" data-type="addmovie" data-list="${docPath}" data-movieid="${movieid}">
                        <i class='bx bx-list-plus bx-sm'></i>
                        <span>${title}</span>
                    </li>
                `

            }).join('')
            return html
        }
        else {
            return ``
        }
    }

    const handleOpenMenu = (lists, target) => {

        // Set this value in the module scope so the close function can access it
        // when the context menu is closed
        btnThatOpenedTheMenu = target
        btnThatOpenedTheMenu.classList.add('movie__add-btn--active')
        movieCardEl = target.closest('li')
        
        const { movieid, movietitle } = target.dataset
        refresh(lists, movieid, movietitle)
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
        if (!wasInside) {
            closeMenu()
        }
    }

    const closeMenu = () => {
        btnThatOpenedTheMenu.classList.remove('movie__add-btn--active')
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

    const refresh = (lists, movieid, movietitle) => {   
        node.innerHTML = render(lists, movieid, movietitle)
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