import { auth } from '../data/auth'
import { router } from '../pages/router'
import { timer } from '../utils/utils'

const db = await (async () => {
    const { db } = await import('../data/db')
    return db
})()

const Header = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        }) 
    }

    const handleClick = e => {
        const execute = {
            'navigate': () => {
                const catchAllRoute = Boolean(currUser) ? '/mylists' : '/'
                const pathname = e.target.pathname || catchAllRoute
                router.navigate(pathname)
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
            
            const photoURL = account.photoURL

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
                <img src="${photoURL}" class="header__avatar" alt="User avatar image">
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
                    <img class="header-logo-img" src="/assets/logo.png" alt="Reel Talk logo">
                    <h1 class="header-logo" data-type="refresh">Reel Time</h1>
                </div>
                <ul class="header-menu" id="menu">
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