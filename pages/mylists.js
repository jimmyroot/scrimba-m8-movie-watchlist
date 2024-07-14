import { db } from '../data/db'
import { auth } from '../data/auth'
import { router } from '../pages/router'
import { percentageOfTrue } from '../utils/utils'
import { modalWithConfirm } from '../components/modalwithconfirm'

const MyLists = async () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
    }

    const handleClick = e => {
        const execute = {
            navigate: () => {
                const path = (e.target.dataset.path.split('/'))[1]
                router.navigate(`/list/${path}`)        
            },
            remove: async () => {
                const { path, title } = e.target.closest('li').dataset
                const result = (await modalWithConfirm.show(`Are you sure you want to delete your '${title}' watchlist?`)) === 'yes' ? true : false
                if (result) await db.removeListAtPath(path)
            },
            new: async () => {      
                console.log('making new list')
                const params = {
                    uid: auth.getUser().uid,
                    title: document.getElementById('input-watchlist-title').value
                }
                await db.createList(params)
            }
        }
        e.preventDefault()
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const render = async (lists) => {
        const html = `
            <header class="page__header">
                <div class="header__new-watchlist-input">
                    <label for="input-watchlistlist-title">New Watchlist Title</label>
                    <input class="new-watchlist__input" id="input-watchlist-title" type="text" placeholder="New watchlist name">
                    <button class="new-watchlist__btn" id="btn-new-watchlist" data-type="new"><i class='bx bx-plus bx-sm'></i></button>
                </div>
            </header>
            
            <section id="page-section" class="page__section watchlists__container">
                <ul class="watchlists__list">
                    ${renderLists(lists)}
                </ul>
            </section>
        `

        return html
    }

    const renderLists = lists => {
        
        let html = ``

        if (lists.length > 0) {
            html = lists.map(list => {
                const { data, docPath } = list
                const moviesCount = data.movies.length
                const watchedBoolArr = data.movies.reduce((watchedArr, movie) => {
                    watchedArr.push(movie.watched)
                    return watchedArr
                }, [])
                const percentComplete = percentageOfTrue(watchedBoolArr)

                return `
                    <li class="watchlist__item" data-type="navigate" data-path="${docPath}" data-title="${data.title}">
                        <h3 class="item__title"><a class="item__link" href="#">${data.title}</a></h3>
                        <div class="item__details">
                        <p>🎬 Movies: ${moviesCount}</p>
                        <p>🍿 Watched: ${percentComplete}%</p>
                        </div>
                        <div class="item__progbar">
                            <div class="item__progbar-prog" style="width: ${percentComplete}%"></div>
                        </div>
                        <button class="item__btn-remove" id="remove-list-btn" data-type="remove">
                            <i class='bx bx-trash'></i>
                        </button>
                    </li>
                `
            }).join('')
        }
        else {
            html = `
                <li class="page__empty">
                    <p><i class='bx bx-list-ul bx-lg'></i></p>
                    <p>
                        Looks like you haven't added any lists yet! Enter a list name and click + to add your first list.
                    </p>
                </li>
            `
        }

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
        node.innerHTML = await render(lists)

        // Insert modal
        setTimeout(node.append(modalWithConfirm.get()), 500)
    }

    const get = async () => {
        // We don't need to refresh as the listener is doing this for us
        return node
    }

    const node = document.createElement('main')
    node.classList.add('main')
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