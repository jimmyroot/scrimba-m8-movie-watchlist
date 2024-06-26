/*

Routes are configured at the bottom of the module (has to be down there 
as it uses an arrow function that has to be declard first, of course this 
wouldn't be an issue if I was using the function keyword but...well, I'm not!

*/
import { auth } from '../data/auth'
import { home } from '../pages/home'
import { findmovies } from '../pages/findmovies'
import { mylists } from './mylists'
import { list } from './list'
import { signIn } from './signin'
import { signUp } from './signup'
import { header } from '../components/header'
import { footer } from '../components/footer'

const Router = () => {

    let routes = {}

    const populateRoutes = () => {
        routes = {
            '/': {
                module: home,
                linkLabel: 'Home',
                requiresLogin: false,
                content: [] // imported module.get() ?
            },
            '/findmovies': {
                module: findmovies,
                linkLabel: 'Find Movie',
                requiresLogin: true,
                content: []
            },
            '/mylists': {
                module: mylists,
                linkLabel: 'My Lists',
                requiresLogin: true,
                content: []
            },
            '/list': {
                module: list,
                linkLabel: null,
                requiresLogin: true,
                content: []
            },
            '/signin': {
                module: signIn,
                linkLabel: 'Sign In',
                requiresLogin: false,
                content: []
            },
            '/signup': {
                module: signUp,
                linkLabel: 'Sign Up',
                requiresLogin: false,
                content: []
            },
            '/unknown': {
                content: (() => {
                    const node = document.createElement('div')
                    node.innerHTML = `
                        <h1>Well, this is embarassing.</h1>
                        <p>We couldn't find what you requested. Please click 
                        <a href="/" data-type="navigate">here</a> to return to
                        the homepage.
                        </p>
                    `
                    return node
                })()
            }
        }
    }

    const registerRouterWithBrowserNavigation = () => {
        window.onpopstate = () => navigate(location.pathname)
    }

    const compilePage = async (page, user, route, listPath) => {
        try {
            const nodes = [
                header.get(route, user),
                await page.get(user, listPath),
                footer.get()
            ]
            return nodes
        } catch (e) {
            console.error(`Error compiling page. The error was: ${e}`)
        }
    }

    // This will run every time the user manually refreshes, makes sure that the current
    // location in the address bar is always loaded
    const initialize = () => {
        auth.onAuthStateChanged(auth.get(), user => {
            const destination = location.pathname
            const routeExists = Boolean(routes[destination])
            if (routeExists) {
                const { requiresLogin } = routes[destination]
                const go = {
                    loggedIn: () => {
                        (destination === '/signin' || destination === "/signup") ?
                            navigate('/mylists') : 
                            navigate(destination)
                    },
                    notLoggedIn: () => {
                        requiresLogin ? navigate('/') : navigate(destination)
                    }
                }
                user ? go['loggedIn']() : go['notLoggedIn']()
            }
            else {
                navigate(destination)
            }
        })
    }

    const navigate = (route, listPath) => {
        
        history.pushState({}, "", route)
        render(route, listPath)
    }

    const render = async (route, listPath) => {
        
        // Remove any trailing slash (unless route is homepage)
        if (route != '/') route = route.replace(/\/$/, "")

        // Split the requested path in case we want to query it
        // const path = route.split('/')
        
        // Try to render the given path, if anything goes wrong set route to unknown and go...
        try {
            routes[route].content = await compilePage(routes[route].module, auth.getUser(), route, listPath)
            const nodesToRender = routes[route].content
            document.querySelector('#app').replaceChildren(...nodesToRender)
        }
        catch (e) {
            console.error(e)
            document.querySelector('#app').replaceChildren(routes['/unknown'].content)
        }
    }

    // Router init
    populateRoutes()
    registerRouterWithBrowserNavigation()
    
    return {
        navigate,
        initialize
    }
}

export const router = Router()