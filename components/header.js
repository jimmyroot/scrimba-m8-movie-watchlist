import { auth } from '../data/auth'
import { router } from '../pages/router'

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

    const render = (page, user) => {
        const nav = Boolean(user) ? 
            `
                <li>
                    <a href="/findmovies" data-type="navigate">Find Movies</a>
                </li>
                <li>
                    <a href="/mylists" data-type="navigate">My Lists</a>
                </li>
                <li>
                    <a href="#" class="sign-in" data-type="signout">Sign out</a>
                </li>
            ` 
        :   `
                <li>
                    <a href="#">Sign up</a>
                </li>
                <li>
                    <a href="/signin" class="sign-in" data-type="navigate">Sign in</a>
                </li>
            `

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

    const refresh = (page, user) => {
        node.innerHTML = render(page, user)
    }

    const get = (page, user) => {
        refresh(page, user)
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