//Mylists.js — loads the logged in users lists
import { db } from '../data/db'
import { auth } from '../data/auth'
import { router } from '../pages/router'
import { percentageOfTrue, validateEmail } from '../utils/utils'
import { modalWithConfirm } from '../components/modalwithconfirm'

const MyLists = async () => {
  // Click handler
  const handleClick = (e) => {
    const execute = {
      navigate: () => {
        const path = e.target.dataset.path.split('/')[1]
        router.navigate(`/list/${path}`)
      },
      remove: async () => {
        const { path, title } = e.target.closest('li').dataset
        const result =
          (await modalWithConfirm.show(
            `Are you sure you want to delete your '${title}' watchlist?`
          )) === 'yes'
            ? true
            : false
        if (result) await db.removeListAtPath(path)
      },
      new: async () => {
        await validateInputAndCreateNewList()
      },
    }
    e.preventDefault()
    const { type } = e.target.dataset
    if (execute[type]) execute[type]()
  }

  // Input handler
  const handleInput = (e) => {
    if (e.target.classList.contains('warning'))
      e.target.classList.remove('warning')
  }

  // keyUp handler, run the search if Enter key is pressed
  const handleKeyUp = (e) => {
    if (e.code === 'Enter') validateInputAndCreateNewList()
  }

  // Main render function
  const render = async (lists) => {
    const html = `
            <header class="page__header">
                <div class="header__new-watchlist-input">
                    <label for="input-watchlist-title">New Watchlist Title</label>
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

  // Render the html for the user's lists, or a placeholder if they have none
  const renderLists = (lists) => {
    let html = ``

    if (lists.length > 0) {
      html = lists
        .map((list) => {
          const { data, docPath } = list
          const moviesCount = data.movies.length

          // Create a new array of all the true/false (watched/unwatched) values
          const watchedBoolArr = data.movies.reduce((watchedArr, movie) => {
            watchedArr.push(movie.watched)
            return watchedArr
          }, [])

          // Use the array from the last step to calculate percentage of movies watched,
          // Use it to fill 'Watched: ' but also for the width of the progress bar on each
          // list
          const percentComplete = percentageOfTrue(watchedBoolArr)

          return `
                    <li class="watchlist__item" data-type="navigate" data-path="${docPath}" data-title="${data.title}">
                        <h3 class="item__title">${data.title}</h3>
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
        })
        .join('')
    } else {
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

  // Make sure the input field isn't empty and create a new list
  const validateInputAndCreateNewList = async () => {
    const input = document.getElementById('input-watchlist-title')
    const value = input.value
    if (value) {
      const params = {
        uid: auth.getUser().uid,
        title: document.getElementById('input-watchlist-title').value,
      }
      await db.createList(params)
    } else {
      input.classList.add('warning')
    }
  }

  // This listener is slightly different to the one in list.js, instead of a
  // document it listens to the results of a query via a querySnapshot
  // In this case it's querying all lists that match the users UID, every time
  // that data changes the page will refresh (basically when lists are added
  // or deleted). To be fair, this could of been done with a manual refresh and
  // I'm sure it would work just fine, but this seems way cooler :)
  const listenForChangesAndRefreshLists = async (uid) => {
    const q = db.query(
      db.collection(db.db, 'lists'),
      db.where('uid', '==', uid)
    )
    unsubscribeFromListsListener = db.onSnapshot(q, (querySnapshot) => {
      const lists = []
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          lists.push({
            docPath: doc.ref.path,
            data: doc.data(),
          })
        })
      }
      refresh(lists)
    })
  }

  // Append modal function
  const appendModal = () => {
    const modal = modalWithConfirm.get()
    node.append(modal)
  }

  // Refresh the page, in this context called only by
  // listnForChangesAndRefreshLists()
  const refresh = async (lists) => {
    node.innerHTML = await render(lists)
    appendModal()
  }

  // Returns the node with modal appended; we have to apend
  // the modal here, as well as in the refresh function, because often times
  // this page will be refreshed without 'get' being called, or
  // get will be called when the data hasn't been refreshed...so if
  // we don't call in both locations, sometimes a situation occurs
  // where the list has rendered but the modal isn't in the DOM
  const get = async () => {
    appendModal()
    return node
  }

  // Initialize the node
  const node = document.createElement('main')
  node.classList.add('main')
  let unsubscribeFromListsListener = null

  // for any content that will use the user id, we need to use
  // onAuthState changed. E.g. here we are loading lists based on
  // if they belong to the logged in user ID, and we also
  // want the behaviour that if the user is for some reason logged out,
  // they will get re-directed back to the homepage. Unlike list.js which
  // only loads a list based on it's path, we don't use the user ID...so in
  // that case we don't need on authstatechanged
  //
  // This runs all the time after the module is imported, so only needs to be
  // called once, here, and will refresh the data as appropriate on this page
  await auth.onAuthStateChanged(auth.get(), (user) => {
    if (user) {
      node.innerHTML = ``
      listenForChangesAndRefreshLists(user.uid)
    } else {
      if (!unsubscribeFromListsListener === null) unsubscribeFromListsListener()
    }
  })

  // Add event listeners
  node.addEventListener('click', handleClick)
  node.addEventListener('input', handleInput)
  node.addEventListener('keyup', handleKeyUp)

  return {
    get,
  }
}

export const mylists = await MyLists()
