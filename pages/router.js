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
                requiresLogin: false,
                content: [] // imported module.get() ?
            },
            '/findmovies': {
                module: findmovies,
                requiresLogin: true,
                content: []
            },
            '/mylists': {
                module: mylists,
                requiresLogin: true,
                content: []
            },
            '/list': {
                module: list,
                requiresLogin: true,
                content: []
            },
            '/signin': {
                module: signIn,
                requiresLogin: false,
                content: []
            },
            '/signup': {
                module: signUp,
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
        window.onpopstate = e => {
            navigate(location.pathname, false)
        }
    }

    const compilePage = async (page, user, route, listPath) => {
        try {
            const nodes = [
                await header.get(route, user),
                await page.get(user, listPath),
                footer.get()
            ]
            return nodes
        } catch (e) {
            console.error(e)
        }
    }

    // This will run every time the user manually refreshes, makes sure that the current
    // location in the address bar is always loaded
    const initialize = () => {
        auth.onAuthStateChanged(auth.get(), async user => {
            navigate(location.pathname)
            // const destination = location.pathname
            // const routeExists = Boolean(routes[destination])
            // if (routeExists) {
            //     const { requiresLogin } = routes[destination]
            //     const go = {
            //         loggedIn: () => {
            //             (destination === '/signin' ||  destination === "/signup" || destination === "/") ?
            //                 navigate('/mylists') : 
            //                 navigate(destination)
            //         },
            //         notLoggedIn: () => {
            //             requiresLogin ? navigate('/') : navigate(destination)
            //         }
            //     }
            //     user ? go['loggedIn']() : go['notLoggedIn']()
            // }
            // else {
            //     navigate(destination)
            // }
        })
    }

    const navigate = (route, doPushState = true) => {
        const destination = route
        const user = auth.getUser()
        const path = `/${route.split('/')[1]}`
        console.log(path)
        const routeExists = Boolean(routes[path])
        console.log(routeExists)
        if (routeExists) {
            const { requiresLogin } = routes[path]
            const go = {
                loggedIn: () => {
                    if (destination === '/signin' ||  destination === "/signup" || destination === "/") {
                        if (doPushState) history.pushState({}, "", '/mylists')
                        render('/mylists')
                    }
                    else {
                        if (doPushState) history.pushState({}, "", destination)
                        render(destination)
                    }
                },
                notLoggedIn: () => {
                    if (requiresLogin) {
                        if (doPushState) history.pushState({}, "", '/')
                        render('/')
                    }
                    else {
                        if (doPushState) history.pushState({}, "", destination)
                        render(destination)
                    }
                    // requiresLogin ? render('/') : render(destination)
                }
            }
            user ? go['loggedIn']() : go['notLoggedIn']()
        }
        else {
            if (doPushState) history.pushState({}, "", destination)
            render(destination)
        }
        // history.pushState({}, "", route)
        // render(route)
        // window.location = route
    }

    const render = async (route) => {
        // Remove any trailing slash (unless route is homepage)
        if (route != '/') route = route.replace(/\/$/, "")

        const path = route.split('/')
        let listPath = ``

        // Handle the case where we are navigating to a list
        if (path[1] === 'list') {
            route = '/'.concat(path[1])
            listPath = 'lists/'.concat(path[2])
        }
        
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