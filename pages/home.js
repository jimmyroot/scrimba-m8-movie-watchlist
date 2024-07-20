import { router } from './router'

const Home = () => {

    const handleClick = e => {
        const execute = {
            'navigate': () => {
                e.preventDefault()
                const { pathname } = e.target
                router.navigate(pathname)
            }
        }
        
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }
    
    const render = () => {
        const html = `
        <section class="page__container page__container-large">
            <h1 class="home__tagline">Discover. Curate. Watch.</h1>
            <p class="home__cta">
                Your movie watchlists, sorted. Click below to get started, or
                <a href="/signin" data-type="navigate">sign in with Google or Github!</a>
            </p>  
            </p>
            <a class="home__signup-btn" href="/signup" data-type="navigate">
                Get started
                <i class='bx bxs-chevron-right bx-md'></i>
            </a>
        </section>
        `
        
        return html
    }

    const refresh = () => {
        node.innerHTML = render()
    }

    const get = () => {
        refresh()
        return node
    }

    const node = document.createElement('main')
    node.addEventListener('click', handleClick)
    node.classList.add('main')

    return {
        get,
    }
}

export const home = Home()