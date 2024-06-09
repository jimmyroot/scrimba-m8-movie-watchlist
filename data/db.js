import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js'
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, Timestamp, runTransaction } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js'

const omdb = await (async () => {
    const { omdb } = await import('../data/omdb')
    return omdb
})()

const firebaseConfig = {
    apiKey: "AIzaSyCwbb7PceRaS4TpHA422uRqU3f7aHKLB38",
    authDomain: "reel-talk-28ac2.firebaseapp.com",
    projectId: "reel-talk-28ac2",
    storageBucket: "reel-talk-28ac2.appspot.com",
    messagingSenderId: "443433011935",
    appId: "1:443433011935:web:eea850249032f956a2376a",
    measurementId: "G-ZQE3HNSMHS"
}

const Db = async () => {

    const initDB = async () => {
        return await initializeApp(firebaseConfig)  
    }

    const getAccount = async id => {
        const profileDocRef = doc(db, 'accounts', id)
        const profileDocSnapshot = await getDoc(profileDocRef)

        if (profileDocSnapshot.exists()) {
            return profileDocSnapshot.data()
        }
        else {
            console.log('User account does not exist')
        }
    }

    const getMovie = async id => {
        const movieDocRef = doc(db, 'movies', id)

        const movieDocSnapshot = await getDoc(movieDocRef)

        if (movieDocSnapshot.exists()) {
            return movieDocSnapshot.data()
        }
        else {
            return false
        }
    }

    const createAccount = async user => {
        try {
            const accounts = collection(db, 'accounts')
            const accountDoc = doc(accounts, user.uid)
            const userObj = {
                displayName: user.displayName,
                firstName: null,
                familyName: null,
                photoURL: user.photoURL,
                favoriteGenres: []
            }

            // set the new doc inside profiles
            await setDoc(accountDoc, userObj)
            
            createList({ uid: user.uid})
        }
        catch (e) {
            console.error(`Something went wrong during user creation. The error was ${e}`)
        }
    }

    // Create a new list with unique ID — addDoc()
    const createList = async params => {
        const lists = collection(db, 'lists')
        const listDocRef = await addDoc(lists, {
            uid: params.uid,
            title: 'My Sci-Fi list',
            createdAt: serverTimestamp(),
            movies: []
        })
    }

    // addMovie, called when a user adds a movie to a list, adds the movie
    // to our internal movies collection if it doesn't already exist
    const addMovieToDB = async movie => {
        try {
            await runTransaction(db, async transaction => {
                const movieRef = doc(db, 'movies', movie.imdbID)
                const movieDoc = await transaction.get(movieRef)
                if (!movieDoc.exists()) {
                    const fullMovieData = await omdb.getMovieByIMDBId(movie.imdbID)
                    transaction.set(movieRef, fullMovieData)
                }
                else {
                    throw `There is already a local entry for ${movie.imdbID}`
                }
            })
            console.log(`Success! Movie ${movie.imdbID} was added to the local movies collection.`)
        }
        catch (e) {
            console.log(`Adding movie to local DB failed because: ${e}`)
        }
    }

    const addMovieToList = async (listID, movie) => {
        try {
            await runTransaction(db, async transaction => {

                // First make sure requested list exists
                const listDocRef = doc(db, 'lists', listID)
                const list = await transaction.get(listDocRef)
                if (!list.exists()) {
                    throw `The specified list does not exist`
                }

                // Now check that the movie is not already on the
                // list
                const movies = list.data().movies
                const movieExists = movies.find(entry => entry.imdbID === movie.imdbID)

                // Try to add the movie
                try {
                    if (!Boolean(movieExists)) {

                        const now = Timestamp.now()
                        const newEntry = {
                            imdbID: movie.imdbID,
                            watched: false,
                            addedAt: now,
                            comments: null
                        }

                        // Add the movie to the movies collection
                        await addMovieToDB(movie)

                        // Check it exists in the local movies collection and proceed
                        const localMovieDataRef = doc(db, 'movies', movie.imdbID)
                        const movieInDB = await transaction.get(localMovieDataRef)

                        if (movieInDB.exists()) {
                            transaction.update(listDocRef, {
                                movies: arrayUnion(newEntry)
                            })
                            console.log(`Successfully added movie ${movie.imdbID} to list ${listID}`)
                        } else {
                            throw `Local movie data not found...was it added to local movies collection?`
                        }
                    }
                    else {
                        throw `The movie is already on the list`
                    }
                }
                catch (e) {
                    console.error(`Failed to add movie ${movie.imdbID} to list ${listID} because: ${e}`)
                }
            })
        }
        catch (e) {
            console.error(`Failed to add movie ${movie.imdbID} to list ${listID} because: ${e}`)
        }
    }

    const removeMovieFromList = async (listID, movie) => {
        // check if the list contains the movie we want to remove
        // remove the movie using arrayRemove (the object)

        try {
            await runTransaction(db, async (transaction) => {

                const listDocRef = doc(db, 'lists', listID)
                const list = await transaction.get(listDocRef)
                if (!list.exists()) throw `The specified list doesn't exist`
                
                const movies = list.data().movies
                const movieToRemove = movies.find(entry => entry.imdbID === movie.imdbID)

                try {
                    if (movieToRemove) {
                        await transaction.update(listDocRef, {
                            movies: arrayRemove(movieToRemove)
                        })
                        console.log(`Success! The movie ${movie.imdbID} was removed from list ${listID}`)
                    }
                    else {
                        throw `The specified movie wasn't found on this list`
                    }
                }
                catch (e) {
                    console.error(`Couldn't remove the movie ${movie.imdbID} from list ${listID} because: ${e}`)
                }

                
            })
            
        }
        catch (e) {
            console.error(`Failed to remove because: ${e}`)
        }
    }

    const get = () => {
        return app
    }

    const app = await initDB()
    const db = await getFirestore(app)

    return {
        get,
        getAccount,
        createAccount,
        createList,
        addMovieToDB,
        addMovieToList,
        removeMovieFromList
    }
}

export const db = Db()