import { auth } from '../data/auth'
import { router } from '../pages/router'

const db = await (async () => {
    const { db } = await import('../data/db')
    return db
})()

const MyLists = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
    }

    const handleClick = e => {
        const execute = {
            navigate: () => {
                const { path } = e.target.dataset
                router.navigate('/list', path)
                console.log(`navigating to ${path}`)
            }
        }
        e.preventDefault()
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const render = async () => {
        const html = `
            <h1>My Watchlists</h1>
            ${await getListsHTML()}
        `
        return html
    }

    const getListsHTML = async () => {
        const uid = await auth.getUser().uid
        const lists = await db.getListsForUser(uid)

        let html = ``
        
        if (lists) {
            html = lists.map(list => {
                const { data, docPath } = list
                
                return `
                    <h3><a href="#" data-type="navigate" data-path="${docPath}">${data.title}</a></h3>
                `
            })
        }
        
        return html
    }

    const refresh = async () => {
        node.innerHTML = await render()
    }

    const get = () => {
        refresh()
        return node
    }

    const node = document.createElement('main')
    node.classList.add('mylists')
    registerEventListeners()

    return {
        get
    }
}

export const mylists = MyLists()