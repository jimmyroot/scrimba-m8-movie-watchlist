import { auth } from '../data/auth'
import { router } from '../pages/router'

const db = await (async () => {
    const { db } = await import('../data/db')
    return db
})()

const MyLists = async () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
    }

    const handleClick = e => {
        const execute = {
            navigate: () => {
                const { path } = e.target.closest('div').dataset
                router.navigate('/list', path)
            },
            remove: async () => {
                const { path } = e.target.closest('div').dataset
                await db.removeListAtPath(path)
            },
            new: async () => {
                const params = {
                    uid: auth.getUser().uid,
                    title: document.getElementById('new-list-title').value
                }
                await db.createList(params)
            }
        }
        e.preventDefault()
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const render = (lists) => {
        const html = `
            ${renderNewListForm()}
            <h1>My Watchlists</h1>
            <section>
                ${renderLists(lists)}
            </section>
        `

        return html
    }

    const renderLists = lists => {
        let html = ``

        if (lists) {
            html = lists.map(list => {
                const { data, docPath } = list

                return `
                <div data-path="${docPath}">
                    <h3><a href="#" data-type="navigate">${data.title}</a></h3>
                    <button id="remove-list-btn" data-type="remove">Remove</button>
                </div>
                `
            })
        }

        return html
    }

    const renderNewListForm = () => {
        let html = `
            <form id="mylists-new-list-form">
                <input type="text" id="new-list-title">
                <button id="new-list-btn" data-type="new">New list</button>
            </form>
        `
        return html
    }

    const listenForChangesAndRefreshLists = async uid => {
        const q = db.query(db.collection(db.db, 'lists'), db.where("uid", "==", uid))
        unsubscribeFromListsListener = db.onSnapshot(q, querySnapshot => {
            const lists = []
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    lists.push({
                        docPath: doc.ref.path,
                        data: doc.data()
                    })
                })
            }
            refresh(lists)
        })
    }

    const refresh = async (lists) => {
        node.innerHTML = render(lists)
    }

    const get = async () => {
        // node.innerHTML = ``
        // We don't need to refresh as the listener is doing this for us
        return node
    }

    const node = document.createElement('main')
    node.classList.add('mylists')
    let unsubscribeFromListsListener = null

    // for any content that will use the user id, we need to use
    // onAuthState changed. E.g. here we are loading lists based on 
    // if they belong to the logged in user ID. Unlike list.js which 
    // only loads a list based on it's path, we don't use the user ID...so there,
    // we don't need on authstatechanged
    await auth.onAuthStateChanged(auth.get(), user => {
        if (user) {
            node.innerHTML = ``
            listenForChangesAndRefreshLists(user.uid)
        } else {
            if (!unsubscribeFromListsListener === null) unsubscribeFromListsListener()
        }
    })

    registerEventListeners()

    return {
        get
    }
}

export const mylists = await MyLists()