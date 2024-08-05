// Router.js - orchestrate page loading, navigation inc.
// browser history, and access to restricted pages
// that require a login

import routes from './routes.js'
import { auth } from '/data/auth'
import { header } from '/components/header'
import { footer } from '/components/footer'

const Router = () => {
  // Compiles a single page and returns an array of the nodes,
  // header, page content and footer. Calls 'get' of each module
  const compilePage = async (page, user, route, listPath) => {
    try {
      const nodes = [
        await header.get(route, user),
        await page.get(user, listPath),
        footer.get(),
      ]
      return nodes
    } catch (e) {
      console.error(`compilePage() error: ${e}`)
    }
  }

  // This will run every time the user manually refreshes the site,
  // it makes sure that the current is loaded, so the app doesn't 'reset'
  // It also makes sure that the page refreshes if the auth state changes,
  // If the user logs out they will be re-directed back to the homepage
  const initialize = appRootEl => {
    // set root element
    rootEl = appRootEl

    // set onAuthStateChanged listener
    auth.onAuthStateChanged(auth.get(), async user => {
      navigate(location.pathname)
    })
  }

  // Navigate function, called whenever a user clicks a link...takes a route and a boolean
  // as parametes. Route is where we're going, doPushState says whether we want to add
  // the route to history or not. If the user clicks back in the browser, we don't want
  // to pushState, because then we are back at the start of the history trail and the
  // app won't behave as expected
  const navigate = (route, doPushState = true) => {
    // Set up vars for the navigate operation
    const destination = route
    const user = auth.getUser()
    const path = `/${route.split('/')[1]}`
    const routeExists = Boolean(routes[path])

    // If route exists try and navigate to it, if not try and render whatever was requested,
    // this will usually result in the unknown text being displayed (yes I've been lazy and not
    // styled it but I've done enough for now, lol
    if (routeExists) {
      // Does the requested route require the user to be logged in?
      const { requiresLogin } = routes[path]

      // This is kind of a little logic tree to decide where to send the user
      // depending on what page was requested and if they are logged in or not.
      // For example if they are already logged in, but they request the sign in page,
      // we'll send them to '/mylists'. Same if they try to go to '/signup' or
      // the '/' homepage, otherwise just render the page.
      //
      // If they are not logged in, and the page requires a login
      // send them back to '/', else render the page.
      const go = {
        loggedIn: () => {
          if (
            destination === '/signin' ||
            destination === '/signup' ||
            destination === '/'
          ) {
            if (doPushState) history.pushState({}, '', '/mylists')
            render('/mylists')
          } else {
            if (doPushState) history.pushState({}, '', destination)
            render(destination)
          }
        },
        notLoggedIn: () => {
          if (requiresLogin) {
            if (doPushState) history.pushState({}, '', '/')
            render('/')
          } else {
            if (doPushState) history.pushState({}, '', destination)
            render(destination)
          }
          // requiresLogin ? render('/') : render(destination)
        },
      }

      // Is there a user? If so, execute the loggedIn path, else execute
      // the nogLoggedIn path
      user ? go['loggedIn']() : go['notLoggedIn']()
    }
    // If the route didnt' exist, just run the render function, which results in
    // the unknown route being displayed
    else {
      if (doPushState) history.pushState({}, '', destination)
      render(destination)
    }
  }

  // Ok, we decided if we can show the page or not in navigate(), now what? Render the route
  const render = async route => {
    // Remove any trailing slash (unless route is homepage)
    if (route != '/') route = route.replace(/\/$/, '')

    // Split up the path so we can parse it more easily
    const path = route.split('/')
    let listPath = ``

    // Determine if we are navigating to a list and adjust the route and listPath accordingly
    if (path[1] === 'list') {
      route = '/'.concat(path[1])
      listPath = 'lists/'.concat(path[2])
    }

    // Try to render the resulting path, if anything goes wrong set route to unknown and proceed
    try {
      // Comile the page into the content property of the relevant route object, pass in the
      // params we need, they will be ignored if not needed
      routes[route].content = await compilePage(
        routes[route].module,
        auth.getUser(),
        route,
        listPath
      )
      // Update the DOM with the page we just rendered
      rootEl.replaceChildren(...routes[route].content)
    } catch (e) {
      console.error(`Router error: ${e}`)
      // If there was an error, show the unknown route so the user knows there is a problem
      rootEl.replaceChildren(routes['/unknown'].content)
    }
  }

  // initialize app container variable, register our navigate function with onpopstate
  let rootEl = null
  window.onpopstate = e => navigate(location.pathname, false)

  return {
    navigate,
    initialize,
  }
}

export const router = Router()
