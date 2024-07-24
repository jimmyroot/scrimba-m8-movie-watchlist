import { home } from '../pages/home'
import { findmovies } from '../pages/findmovies'
import { mylists } from './mylists'
import { list } from './list'
import { signIn } from './signin'
import { signUp } from './signup'

const routes = {
    '/': {
        module: home,
        requiresLogin: false,
        content: []
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

export default routes