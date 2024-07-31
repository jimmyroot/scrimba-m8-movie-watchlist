// All code pertaining to the Firestore db instance excluding auth, which is in auth.js
// Everything relating to creating, updating, and deleting records/documents is in here

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js'

import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp,
  runTransaction,
  query,
  where,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js'

import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'
import { omdb } from '../data/omdb'
import { splitName } from '../utils/utils'
import { FB_API_KEY } from './keys'

const firebaseConfig = {
  apiKey: FB_API_KEY,
  authDomain: 'reel-talk-28ac2.firebaseapp.com',
  projectId: 'reel-talk-28ac2',
  storageBucket: 'reel-talk-28ac2.appspot.com',
  messagingSenderId: '443433011935',
  appId: '1:443433011935:web:eea850249032f956a2376a',
  measurementId: 'G-ZQE3HNSMHS',
}

const Db = async () => {
  // Initialize the database instance
  const initDB = async () => {
    return await initializeApp(firebaseConfig)
  }

  // Get account data for the given user id from the db
  const getAccount = async id => {
    const profileDocSnapshot = await getDoc(doc(db, 'accounts', id))

    if (profileDocSnapshot.exists()) {
      return profileDocSnapshot.data()
    } else {
      // console.log('User account does not exist')
    }
  }

  // Get movie data for a single movie in our local movies collection
  const getMovie = async id => {
    const movieDocRef = doc(db, 'movies', id)
    const movieDocSnapshot = await getDoc(movieDocRef)

    if (movieDocSnapshot.exists()) {
      return movieDocSnapshot.data()
    } else {
      return false
    }
  }

  // Retrieve all movies in the array of IDs from our local 'movies' collection
  // and return as an array, using a firestore query
  const getMovies = async arrMovieIDs => {
    const movies = []
    const moviesRef = collection(db, 'movies')

    const q = query(moviesRef, where('imdbID', 'in', arrMovieIDs))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      querySnapshot.forEach(doc => {
        movies.push(doc.data())
      })
      return movies
    } else {
      return false
    }
  }

  // Get all lists for a specific user id and return them
  const getListsForUser = async id => {
    // Get a collection reference
    const listsRef = collection(db, 'lists')

    // Create a query
    const q = query(listsRef, where('uid', '==', id))

    // Get a snapshot of data matching the query
    const querySnapshot = await getDocs(q)

    // Check if it contains any data, if yes then add it to
    // an array and return it. We return the full path of the list
    // (docPath) which is used for navigation and other things later,
    // and then we also return the actual data contained in the list
    if (!querySnapshot.empty) {
      const lists = []
      querySnapshot.forEach(doc => {
        lists.push({
          docPath: doc.ref.path,
          data: doc.data(),
        })
      })
      return lists
    } else {
      return false
    }
  }

  // Get watchlist data for a single list using the full Firestore path e.g. lists/listid
  const getListByPath = async path => {
    // Get a reference using the path
    const listDoc = await getDoc(doc(db, path))
    if (listDoc.exists()) {
      return listDoc.data()
    }
  }

  // Create a new list with unique ID (addDoc() generates the ID). This should
  // Probably be a transaction that checks a few things first (does UID exist,
  // Does a list with the same title already exist? But it works for now)
  const createList = async params => {
    try {
      // Get a reference to the firebase collection
      const lists = collection(db, 'lists')

      // Add a new document to the collection
      const listDocRef = await addDoc(lists, {
        uid: params.uid,
        title: params.title,
        createdAt: serverTimestamp(),
        movies: [],
      })

      // Potentially do something with listDocRef
    } catch (e) {
      console.error(`Something went wrong, the error was: ${e}`)
    }
  }

  // Toggle movie watched status in the DB
  const toggleMovieWatched = async (listPath, movieID) => {
    try {
      // Use a 'transaction', which allows us to batch operations, e.g. we can get
      // read some data first and then update it, or update something else.
      await runTransaction(db, async transaction => {
        const listRef = doc(db, listPath)

        // Not bothering to check if the movie exists, we know it does otherwise there would be
        // no button to click and call this function...it will fail gracefully with 'catch' anyway
        // We go ahead and flip the 'watched' boolean, and write it back
        const targetMoviesArr = (await transaction.get(listRef)).data().movies
        const targetMovie = targetMoviesArr.find(
          movie => movie.imdbID === movieID
        )
        targetMovie.watched = !targetMovie.watched
        await transaction.update(listRef, { movies: targetMoviesArr })
      })
    } catch (e) {
      console.error(`Something went wrong! The error was: ${e}`)
    }
  }

  // Get all movies in a given list
  const getMoviesFromList = async listPath => {
    const movies = await getDoc(doc(db, listPath))
    if (movies.exists()) return movies.data().movies
  }

  // Remove the list at the given path, should probably do some more checks
  // to verify that the list exists first :) but oh well
  const removeListAtPath = async path => {
    try {
      await deleteDoc(doc(db, path))
    } catch (e) {
      console.error(`Something went wrong! The error was: {e}`)
    }
  }

  // addMovieToDB. This function pulls a complete copy of the movie data from omdb
  // and stores it in the 'movies' collection in the Firestore db. It's called when
  // a user adds a movie to a list, checks if the movie already exists in our 'local'
  // movie store, and if we don't have it, copies it. This way we can retrieve movie
  // details from our own store rather than use api calls to omdb every time a user
  // loads a list
  const addMovieToDB = async movieID => {
    try {
      await runTransaction(db, async transaction => {
        const movieRef = doc(db, 'movies', movieID)
        const movieDoc = await transaction.get(movieRef)
        if (!movieDoc.exists()) {
          const fullMovieData = await omdb.getMovieByIMDBId(movieID)
          await transaction.set(movieRef, fullMovieData)
        }
      })
    } catch (e) {
      console.error(
        `Something went whilst attempting to import movie data. The error was: ${e}`
      )
    }
  }

  // This function is used to add a movie to a list
  const addMovieToList = async (docPath, movieID, modal, movieTitle) => {
    try {
      // Batch everything into a transaction
      await runTransaction(db, async transaction => {
        // First make sure requested list exists
        const listDocRef = doc(db, docPath)
        const list = await transaction.get(listDocRef)
        if (!list.exists()) {
          throw `The specified list does not exist`
        }

        // Now check that the movie is not already on the list
        const movies = list.data().movies
        const movieExists = movies.find(entry => entry.imdbID === movieID)

        // Try to add the movie, if it doesn't exist
        try {
          if (!Boolean(movieExists)) {
            // Create a timestamp, will eventually use this to organise the results when
            // the user views a list
            const now = Timestamp.now()

            // Create the object that will represent the movie in the list
            const newEntry = {
              imdbID: movieID,
              watched: false,
              addedAt: now,
              comments: null,
            }

            // Try to add the movie to the 'local' movies collection
            // (will gracefully fail if it's already there,
            // so we can safely call this every time
            await addMovieToDB(movieID)

            // Now check it exists in the local movies collection and proceed...
            const localMovieDataRef = doc(db, 'movies', movieID)
            const movieInDB = await transaction.get(localMovieDataRef)

            if (movieInDB.exists()) {
              // Update the movies field in the target list, we use arrayUnion
              // function to add the entry, directly manipulating the array in Firestore
              await transaction.update(listDocRef, {
                movies: arrayUnion(newEntry),
              })
            }
          } else {
            if (modal)
              modal.show(`'${movieTitle}' is already on that watchlist!`)
          }
        } catch (e) {
          console.error(
            `Failed to add movie ${movieID} to list ${docPath} because: ${e}`
          )
        }
      })
    } catch (e) {
      console.error(
        `Failed to add movie ${movieID} to list ${docPath} because: ${e}`
      )
    }
  }

  // Remove a movie from a list
  const removeMovieFromList = async (listPath, movieID) => {
    try {
      // Batch everything into a transaction
      await runTransaction(db, async transaction => {
        const listDocRef = doc(db, listPath)
        const list = await transaction.get(listDocRef)

        // Check if the list exists, it always should but just to be sure...
        if (!list.exists()) throw `The specified list doesn't exist`

        const movies = list.data().movies
        const movieToRemove = movies.find(entry => entry.imdbID === movieID)

        // Try to remove the movie
        try {
          if (movieToRemove) {
            await transaction.update(listDocRef, {
              movies: arrayRemove(movieToRemove),
            })
          } else {
            if (modal)
              modal.show('Something went wrong, was the movie already removed?')
          }
        } catch (e) {
          console.error(
            `Couldn't remove the movie ${movieID} from list ${listPath}. The error was: ${e}`
          )
        }
      })
    } catch (e) {
      console.error(`Failed to complete the action. The error was: ${e}`)
    }
  }

  // Create the account data for our user in the db, function needs a better name as it's
  // a little misleading (we are actually checking and THEN creating account only if
  // it doesn't exist)
  const createAccount = async user => {
    try {
      // Batch ops in a transaction
      await runTransaction(db, async transaction => {
        const accountDocRef = doc(db, 'accounts', user.uid)
        const accountDoc = await transaction.get(accountDocRef)

        // Generate a name from the displayname (this is all we get from google, github)
        const { givenName, familyName } = splitName(user.displayName)
        let { photoURL } = user
        if (!photoURL) photoURL = '/assets/blank.png'

        // If the account doesn't exist, create it
        if (!accountDoc.exists()) {
          const newAccount = {
            displayName: user.displayName,
            givenName: givenName,
            familyName: familyName,
            photoURL: photoURL,
            favoriteGenres: [],
          }
          await transaction.set(accountDocRef, newAccount)
        }
      })
    } catch (e) {
      if (modal)
        modal.show(
          `Something went wrong while creating the user. The error was: ${e}`
        )
    }
  }

  const get = () => {
    return app
  }

  // Initialize db
  const app = await initDB()
  const db = await getFirestore(app)

  return {
    get,
    getAccount,
    getListsForUser,
    getListByPath,
    getMovies,
    getMoviesFromList,
    createAccount,
    createList,
    removeListAtPath,
    addMovieToDB,
    addMovieToList,
    removeMovieFromList,
    toggleMovieWatched,
    collection,
    onSnapshot,
    query,
    where,
    db,
    doc,
  }
}

export const db = await Db()
