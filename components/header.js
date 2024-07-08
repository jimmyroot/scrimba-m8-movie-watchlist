import { auth } from '../data/auth'
import { router } from '../pages/router'

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
                const { pathname } = e.target
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

    // Use a promise to create a delay in code execution
    const timer = ms => new Promise(res => setTimeout(res, ms))

    const render = async (route, user) => {

        let nav = ``

        if (Boolean(user)) {

            // This is a cheap hack to get around the fact that theres a slight delay
            // between creating the account and when the auth listener in the router
            // triggers a page reload. If account doesn't exist it's because its 
            // still being created, so wait 500ms and try again. keep doing this 
            // until the account has been created
            let account = null

            do {
                account = await db.getAccount(user.uid)
                await timer(500)
            } while (!account)
            
            console.log(account)
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
                <div>
                    <img class="header-logo-img" src="/assets/logo.png" data-type="refresh" alt="Reel Talk logo">
                    <h1 class="header-logo" data-type="refresh">Reel Talk</h1>
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

    const refresh = async (route, user) => {
        node.innerHTML = await render(route, user)        
        const navLinkForCurrentPage = node.querySelector(`[href="${route}"]`)

        // Use if, because for some pages this action won't be valid, so this is easier than coding each case
        if (navLinkForCurrentPage) navLinkForCurrentPage.classList.add('nav__item--active')
    }

    const get = async (route, user) => {
        await refresh(route, user)
        return node
    }

    const node = document.createElement('header')
    node.classList.add('header')
    registerEventListeners()

    return {
        get
    }
}

export const header = Header()