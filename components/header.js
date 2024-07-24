// Header module, output will be different depending on whether a 
// user object is passed in when the node is retrieved using the 
// get function
import { auth } from '../data/auth'
import { router } from '../pages/router'
import { timer } from '../utils/utils'
import { db } from '../data/db'

import logoUrl from '../assets/logo-dark.png'
import blankProfImgUrl from '../assets/blank.png'

const Header = () => {

    const handleClick = e => {
        const execute = {
            'hamburger': () => {
                toggleHamburger()
            },
            'navigate': () => {
                const catchAllRoute = Boolean(currUser) ? '/mylists' : '/'
                const pathname = e.target.pathname || catchAllRoute
                router.navigate(pathname)
                const hamburger = document.querySelector('#hamburger')
                if (hamburger.classList.contains('is-active')) toggleHamburger()
                
            },
            'signout': () => {
                auth.fbSignOut()
            }
        }
        e.preventDefault()
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    // Header render function
    const render = async route => {

        let nav = ``

        // Renders nav based on logged in state, either shows logged in nav (lists, etc) 
        // or logged out state (sign up, sign in)
        if (Boolean(currUser)) {

            // This is a cheap hack to get around the fact that theres a slight delay
            // between creating the account and when the auth listener in the router
            // triggers a page reload. If account doesn't exist it's because its 
            // still being created, so wait 500ms and try again. keep doing this 
            // until the account has been created. Only relevant when creating a user on first
            // sign up/sign in
            let account = null

            do {
                account = await db.getAccount(currUser.uid)
                await timer(500)
            } while (!account)
            
            // Set blank profile image, if there is no image url in the users account data
            const avatarUrl = account.photoURL !== '/assets/blank.png' ? account.photoURL : blankProfImgUrl
            
            nav = `
                <ul class="header__menu" id="menu">
                    <li class="nav__item">
                        <a href="/findmovies" class="nav__link ${route === '/findmovies' ? 'nav__link--active' : ''}" data-type="navigate">Find Movies</a>
                    </li>
                    <li class="nav__item">
                        <a href="/mylists" class="nav__link ${route === '/mylists' ? 'nav__link--active' : ''}" data-type="navigate">My Lists</a>
                    </li>
                    <li class="nav__item">
                        <a href="#" class="nav__link" data-type="signout">Sign out</a>
                    </li>
                    <li class="nav__item header__avatar-li">
                        <img src="${avatarUrl}" class="header__avatar" alt="User avatar image">
                    </li>
                </ul>
            `
        }
        else {
            nav = `
                <ul class="header__menu" id="menu">
                    <li class="nav__item">
                        <a href="/signup" class="nav__link ${route === '/signup' ? 'nav__link--active' : ''}" data-type="navigate">Sign up</a>
                    </li>
                    <li class="nav__item">
                        <a href="/signin" class="nav__link nav__sign-in" data-type="navigate">Sign in</a>
                    </li>
                </ul>
            `
        }

        // Main header html, we use the above nav var to build everything out, then return
        const html = `
                <div class="header__logo-div" data-type="navigate">
                    <img class="header__logo-img" src="${logoUrl}" alt="Reel Talk logo">
                    <h1 class="header__logo" data-type="refresh">Reel Time</h1>
                </div>
                
                   ${nav}
                
                <button class="hamburger hamburger--squeeze" id="hamburger" type="button" data-type="hamburger">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                </button>
        `
        
        return html
    }

    // Toggle hamburger and menu state, only applicable at mobile sizes
    const toggleHamburger = () => {
        console.log('toggling')
        document.querySelector('#hamburger').classList.toggle('is-active')
        document.querySelector('.main').classList.toggle('has-no-events')
        node.querySelector('.header__menu').classList.toggle('open')
    }

    // Route is used to highlight the appropriate nav item
    const refresh = async route => {
        node.innerHTML = await render(route)        
        const navLinkForCurrentPage = node.querySelector(`[href="${route}"]`)

        // Use an if, because for some pages this action won't be valid, so this
        // is easier than coding each individual case
        if (navLinkForCurrentPage) navLinkForCurrentPage.classList.add('nav__item--active')
    }

    // In this version of get, we set the current user if it was passed in, and
    // use the route variable to highlight the relevant nav item
    const get = async (route, user) => {
        currUser = user
        await refresh(route)
        return node
    }

    // Initialize the module, here we set up the vars that we'll use and add 
    // event listeners
    const node = document.createElement('header')
    node.classList.add('header')
    let currUser = null

    // Generic click handler
    node.addEventListener('click', handleClick)

    // This one is for closing the hamburger menu when the user clicks outside of it 
    document.addEventListener('click', e => {  
        const menu = document.querySelector('.header__menu')     
        if (!e.target.closest('.header__menu')
            && menu.classList.contains('open')
            && e.target.id != 'hamburger')  { 
                toggleHamburger()
        }
    })

    return {
        get
    }
}

export const header = Header()