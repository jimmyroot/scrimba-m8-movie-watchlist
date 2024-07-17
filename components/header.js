import { auth } from '../data/auth'
import { router } from '../pages/router'
import { timer } from '../utils/utils'
import { db } from '../data/db'

import logoUrl from '../assets/logo.png'
import blankProfImgUrl from '../assets/blank.png'

const Header = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })

        document.addEventListener('click', e => {  
            const menu = document.querySelector('.header__menu')     
            if (!e.target.closest('.header__menu')
                && menu.classList.contains('open')
                && e.target.id != 'hamburger')  { 
                    toggleHamburger()
            }
        })
    }

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

    const render = async route => {

        let nav = ``

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
            
            const avatarUrl = account.photoURL !== '/assets/blank.png' ? account.photoURL : blankProfImgUrl
            
            nav = `
                <li>
                    <a href="/findmovies" data-type="navigate">Find Movies</a>
                </li>
                <li>
                    <a href="/mylists" data-type="navigate">My Lists</a>
                </li>
                <li>
                    <a href="#" data-type="signout">Sign out</a>
                </li>
                <img src="${avatarUrl}" class="header__avatar" alt="User avatar image">
            `
        }
        else {
            nav = `
                <li>
                    <a href="/signup" data-type="navigate">Sign up</a>
                </li>
                <li>
                    <a href="/signin" class="sign-in" data-type="navigate">Sign in</a>
                </li>
            `
        }

        const html = `
                <div class="header__logo-div" data-type="navigate">
                    <img class="header__logo-img" src="${logoUrl}" alt="Reel Talk logo">
                    <h1 class="header__logo" data-type="refresh">Reel Time</h1>
                </div>
                <ul class="header__menu" id="menu">
                   ${nav}
                </ul>
                <button class="hamburger hamburger--3dy" id="hamburger" type="button" data-type="hamburger">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                </button>
        `
        
        return html
    }

    const toggleHamburger = () => {
        console.log('toggling')
        document.querySelector('#hamburger').classList.toggle('is-active')
        document.querySelector('.main').classList.toggle('has-no-events')
        node.querySelector('.header__menu').classList.toggle('open')
    }

    // route is used to highlight the appropriate nav item
    const refresh = async route => {
        node.innerHTML = await render(route)        
        const navLinkForCurrentPage = node.querySelector(`[href="${route}"]`)

        // Use if, because for some pages this action won't be valid, so this is easier than coding each case
        if (navLinkForCurrentPage) navLinkForCurrentPage.classList.add('nav__item--active')
    }

    const get = async (route, user) => {
        currUser = user
        await refresh(route)
        return node
    }

    const node = document.createElement('header')
    node.classList.add('header')
    let currUser = null
    registerEventListeners()

    return {
        get
    }
}

export const header = Header()