/*

Routes are configured at the bottom of the module (has to be down there 
as it uses an arrow function that has to be declard first, of course this 
wouldn't be an issue if I was using the function keyword but...well, I'm not!

*/
import { auth } from '../data/auth'
import { home } from '../pages/home'
import { findmovies } from '../pages/findmovies'
import { mylists } from './mylists'
import { signIn } from './signin'
import { header } from '../components/header'
import { footer } from '../components/footer'
// import { post } from '../pages/post'
// import { myWork } from '../pages/mywork'
// import { about } from '../pages/about'
// import { header } from '../layout/header'

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
            '/signin': {
                module: signIn,
                linkLabel: 'Sign In',
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


    const compilePage = (page, user) => {
        try {
            const nodes = [
                header.get(page, user),
                page.get(user),
                footer.get()
            ]
            return nodes
        } catch (e) {
            console.error(`Error compiling page. The error was: ${e}`)
        }
    }

    const initialize = () => {
        // render(location.pathname)
        auth.onAuthStateChanged(auth.get(), user => {
            const destination = location.pathname
            const routeExists = Boolean(routes[destination])
            if (routeExists) {
                const { requiresLogin } = routes[destination]
                if (user) {
                    console.log(destination)
                    destination === '/signin' ? navigate('/mylists') : navigate(destination)
                    // navigate(destination)
                }
                else {
                    if (requiresLogin) {
                        navigate('/')
                    }
                    else {
                        navigate(destination)
                    }
                }
            }
            else {
                navigate(destination)
            }
        })
    }

    const navigate = (route) => {
        history.pushState({}, "", route)
        render(route)
    }

    const render = async (route) => {
        
        // Remove any trailing slash (unless route is homepage)
        if (route != '/') route = route.replace(/\/$/, "")

        // Split the requested path in case we want to query it
        const path = route.split('/')

        // Get the user info to pass to the page for rendering.
        // Don't allow user to load the sign in page whilst logged in (the user could do this by clicking
        // back in the browser, or manually typing the URL. If they do, we'll redirect them
        // const user = auth.getUser()
        // console.log(user)
        // if (user && path[1] === 'signin') route = '/mylists'
        
        // Try to render the given path, if anything goes wrong set route to unknown and go...
        try {
            routes[route].content = compilePage(routes[route].module, auth.getUser())
            const nodesToRender = routes[route].content
            document.querySelector('#app').replaceChildren(...nodesToRender)
        }
        catch {
            document.querySelector('#app').replaceChildren(routes['/unknown'].content)
        }
    }

    populateRoutes()
    registerRouterWithBrowserNavigation()
    
    return {
        navigate,
        initialize
    }
}

export const router = Router()