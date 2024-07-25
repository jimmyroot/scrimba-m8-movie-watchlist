// This is the context menu, found a simple example online and used that code for
// positioning, displaying etc, had to incorporate it into this module style
// that I've been using, then add the code for getting the users lists, etc.

import { db } from '../data/db'
import { modal } from '../components/modal'

const ListMenu = () => {
  // btnThatOpenedTheMenu is used to control styling on the calling button, just
  // seems a bit more intuitive, visually speaking, for the user
  // movieCardEl is the movie el for the movie being added, we use this so we know
  // where to add the spinner during the add process
  let btnThatOpenedTheMenu = null
  let movieCardEl = null

  // Click handler, uses an object literal to perform a 'switch' depending on the 'type'
  // data attribute of the calling element
  const handleClick = (e) => {
    const execute = {
      addmovie: async () => {
        await addMovie(e.target)
      },
      closelist: () => {
        closeMenu()
      },
    }

    e.preventDefault()
    const { type } = e.target.dataset
    if (execute[type]) execute[type]()
  }

  // Render function to refresh the context menu's data, is called each time
  // the menu is opened
  const render = (lists, movieid, movietitle) => {
    const listsHtml = renderLists(lists, movieid)

    let html = `
            <ul class="context-menu__watchlists" data-movietitle="${movietitle}">
                ${listsHtml}
            </ul>
            <button class="context-menu__close-btn" data-type="closelist">
                <i class='bx bx-x'></i>
            </button>
        `

    return html
  }

  // Render the lists. We use the docPath and the movieid to identity the path and the movie
  // we may need to add
  const renderLists = (lists, movieid) => {
    if (lists) {
      const html = lists
        .map((list) => {
          const { title } = list.data
          const { docPath } = list

          return `
                    <li class="context-menu__list" data-type="addmovie" data-list="${docPath}" data-movieid="${movieid}">
                        <i class='bx bx-list-plus'></i>
                        <span>${title}</span>
                    </li>
                `
        })
        .join('')
      return html
    } else {
      return ``
    }
  }

  // Orchestrates the process of opening the context menu, takes in two arguments
  // an object containing data about the current users available lists and the
  // target (this was the button that opened the list)
  const handleOpenMenu = (lists, target) => {
    // These are values that we created when the context menu was originally imported,
    // locally scoped variables pertaining to the calling btn/movie card, which lets us
    // set their states, etc
    btnThatOpenedTheMenu = target
    btnThatOpenedTheMenu.classList.add('movie__add-btn--active')
    movieCardEl = target.closest('li')

    // Refresh the list and add event listeners for closing it
    const { movieid, movietitle } = target.dataset

    refresh(lists, movieid, movietitle)
    if (menuState != 1) {
      menuState = 1
      node.classList.add(active)
      document.addEventListener('click', handleCloseMenu, {
        capture: true,
      })
      document.addEventListener('keyup', handleKeyUp)
    }
  }

  // Decides whether a click was outside the context menu and if so, close it
  const handleCloseMenu = (e) => {
    const wasInside = document.querySelector('#context-menu').contains(e.target)
    if (!wasInside) {
      closeMenu()
    }
  }

  // Performs the actual task of closing the menu
  const closeMenu = () => {
    // Turn off active class from the btn that originally called it, then close menu,
    // remove event listener
    btnThatOpenedTheMenu.classList.remove('movie__add-btn--active')
    if (menuState != 0) {
      menuState = 0
      node.classList.remove(active)
      document.removeEventListener('click', handleCloseMenu, true)
    }
  }

  // If user pressed escape key, close the menu
  const handleKeyUp = (e) => {
    if (e.which === 27) closeMenu()
  }

  // Get position of the click that is opening the menu
  const getPosition = (e) => {
    var posX = 0
    var posY = 0

    if (!e) {
      let e = window.Event
    }

    if (e.pageX || e.pageY) {
      posX = e.pageX
      posY = e.pageY
    } else if (e.clientX || e.clientY) {
      posX =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft
      posY =
        e.clientY + document.body.scrollTop + document.documentElement.scrollTop
    }

    return {
      x: posX,
      y: posY,
    }
  }

  // Set the position of the menu relative to the click
  const positionMenu = (e) => {
    let posClick = getPosition(e)
    let posClickX = posClick.x
    let posClickY = posClick.y

    let menuWidth = node.offsetWidth + 4
    let menuHeight = node.offsetHeight + 4

    let windowWidth = window.innerWidth
    let windowHeight = window.innerHeight

    let mobileQuery = window.matchMedia('(min-width: 500px)')

    if (mobileQuery.matches) {
      if (windowWidth - posClickX < menuWidth) {
        node.style.left = windowWidth - menuWidth + 'px'
      } else {
        node.style.left = posClickX + 'px'
      }

      if (windowHeight - posClickY < menuHeight) {
        node.style.top = windowHeight - menuHeight + 'px'
      } else {
        node.style.top = posClickY + 'px'
      }
    } else {
      node.style.top = 0
      node.style.left = 0
    }
  }

  // Add the movie  to the relevant list, calls function in the db.js module, takes
  // care of adding the spinner to the movie card, etc
  const addMovie = async (target) => {
    const { list, movieid } = target.dataset
    const { movietitle } = target.closest('ul').dataset
    closeMenu()
    if (list) {
      movieCardEl.classList.add('spinner', 'movie__card--dimmed')
      await db.addMovieToList(list, movieid, modal, movietitle)
      movieCardEl.classList.remove('spinner', 'movie__card--dimmed')
    }
  }

  // Refreshes the list content
  const refresh = (lists, movieid, movietitle) => {
    node.innerHTML = render(lists, movieid, movietitle)
  }

  // Returns the node, used when adding the context menu to the DOM
  const get = () => {
    refresh()
    return node
  }

  // Initialize the module
  const node = document.createElement('div')
  node.id = 'context-menu'
  node.classList.add('context-menu')
  node.addEventListener('click', handleClick)

  // Set basic state
  let menuState = 0
  let active = 'block'

  return {
    get,
    handleOpenMenu,
    positionMenu,
  }
}

export const listMenu = ListMenu()
