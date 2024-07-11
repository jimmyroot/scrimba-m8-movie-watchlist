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
    where } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js'

import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'
import { omdb } from '../data/omdb'
import { splitName } from '../utils/utils'

const { FB_API_KEY } = `$env/static/public`

const firebaseConfig = {
    // apiKey: "AIzaSyCwbb7PceRaS4TpHA422uRqU3f7aHKLB38",
    apiKey: FB_API_KEY,
    authDomain: "reel-talk-28ac2.firebaseapp.com",
    projectId: "reel-talk-28ac2",
    storageBucket: "reel-talk-28ac2.appspot.com",
    messagingSenderId: "443433011935",
    appId: "1:443433011935:web:eea850249032f956a2376a",
    measurementId: "G-ZQE3HNSMHS"
}

const Db = async () => {

    // Initialize the database instance
    const initDB = async () => {
        return await initializeApp(firebaseConfig)  
    }

    // Get account data 
    const getAccount = async id => {
        // this is working
        const profileDocSnapshot = await getDoc(doc(db, 'accounts', id))

        if (profileDocSnapshot.exists()) {
            return profileDocSnapshot.data()
        }
        else {
            console.log('User account does not exist')
        }
    }

    // Get movie data for a single movie in our local movies collection
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
        }
        else {
            return false
        }        
    }

    // Get all lists for a specific user id
    const getListsForUser = async id => {
        const listsRef = collection(db, 'lists')
        const q = query(listsRef, where("uid", "==", id))

        const querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
            const lists = []
            querySnapshot.forEach(doc => {
                lists.push({
                    docPath: doc.ref.path,
                    data: doc.data()
                })
            })
            return lists
        }
        else {
            return false
        }
    }

    const getListByPath = async path => {
        const listDoc = await getDoc(doc(db, path))
        if (listDoc.exists()) {
            return listDoc.data()
        }
    }

    // Create the account data for our user in the db, function needs a better name as it's 
    // a little misleading (we are actually checking and THEN creating account only if 
    // it doesn't exist)
    const createAccount = async user => {
        try {
            await runTransaction(db, async transaction => {
                const accountDocRef = doc(db, 'accounts', user.uid)
                const accountDoc = await transaction.get(accountDocRef)
                const { givenName, familyName } = splitName(user.displayName)
                
                if (!accountDoc.exists()) {
                    const newAccount = {
                        displayName: user.displayName,
                        givenName: givenName,
                        familyName: familyName,
                        photoURL: user.photoURL || '/assets/blank.png',
                        favoriteGenres: []
                    }
                    await transaction.set(accountDocRef, newAccount)
                } else {
                    // Do nothing, the user already exists
                }
            })
        }
        catch (e) {
            console.log(`Something went wrong during user creation. The error was ${e}`)
        }
    }

    // Create a new list with unique ID — addDoc()
    const createList = async params => {
        const lists = collection(db, 'lists')
        const listDocRef = await addDoc(lists, {
            uid: params.uid,
            title: params.title,
            createdAt: serverTimestamp(),
            movies: []
        })
    }

    const toggleMovieWatched = async (listPath, movieID) => {
        try {
            await runTransaction(db, async transaction => {
                const listRef = doc(db, listPath)

                // Not bothering to check if the movie exists, we know it does otherwise there would be
                // no button to click and call this function...it will fail gracefully with 'catch' anyway
                const targetMoviesArr = (await transaction.get(listRef)).data().movies
                const targetMovie = targetMoviesArr.find(movie => movie.imdbID === movieID)
                targetMovie.watched = !targetMovie.watched
                await transaction.update(listRef, {movies: targetMoviesArr})
            } )
        }
        catch (e) {
            console.error(e)
        }
    }

    const getMoviesFromList = async (listPath) => {
        const movies = await getDoc(doc(db, listPath))
        if (movies.exists()) return movies.data().movies
    }

    const removeListAtPath = async path => {
        await deleteDoc(doc(db, path))
    }

    // addMovie, called when a user adds a movie to a list, checks if the full movie data
    // already exists in our
    const addMovieToDB = async movieID => {
        try {
            await runTransaction(db, async transaction => {
                const movieRef = doc(db, 'movies', movieID)
                const movieDoc = await transaction.get(movieRef)
                if (!movieDoc.exists()) {
                    const fullMovieData = await omdb.getMovieByIMDBId(movieID)
                    await transaction.set(movieRef, fullMovieData)
                }
                else {
                    throw `There is already a local entry for ${movieID}`
                }
            })
            console.log(`Success! Movie ${movieID} was added to the local movies collection.`)
        }
        catch (e) {
            console.error(`Adding movie to local DB failed because: ${e}`)
        }
    }

    // Add a movie to a list
    const addMovieToList = async (docPath, movieID, modal, movieTitle) => {
        try {
            await runTransaction(db, async transaction => {
                // console.log(docPath)

                // First make sure requested list exists
                const listDocRef = doc(db, docPath)
                const list = await transaction.get(listDocRef)
                if (!list.exists()) {
                    throw `The specified list does not exist`
                }

                // Now check that the movie is not already on the
                // list
                const movies = list.data().movies
                const movieExists = movies.find(entry => entry.imdbID === movieID)

                // Try to add the movie
                try {
                    if (!Boolean(movieExists)) {
                        const now = Timestamp.now()
                        const newEntry = {
                            imdbID: movieID,
                            watched: false,
                            addedAt: now,
                            comments: null
                        }

                        // Add the movie to the movies collection (will gracefully fail if it's already there)
                        await addMovieToDB(movieID)

                        // Check it exists in the local movies collection and proceed
                        const localMovieDataRef = doc(db, 'movies', movieID)
                        const movieInDB = await transaction.get(localMovieDataRef)

                        if (movieInDB.exists()) {
                            await transaction.update(listDocRef, {
                                movies: arrayUnion(newEntry)
                            })
                            console.log(`Successfully added movie ${movieID} to list ${docPath}`)
                        } else {
                            throw `Local movie data not found...was it added to local movies collection?`
                        }
                    }
                    else {
                        if (modal) modal.show(`'${movieTitle}' is already on that watchlist!`)
                    }
                }
                catch (e) {
                    console.error(`Failed to add movie ${movieID} to list ${docPath} because: ${e}`)
                }
            })
        }
        catch (e) {
            console.error(`Failed to add movie ${movieID} to list ${docPath} because: ${e}`)
        }
    }

    // Remove movie from list
    const removeMovieFromList = async (listPath, movieID) => {
        try {
            await runTransaction(db, async (transaction) => {

                const listDocRef = doc(db, listPath)
                const list = await transaction.get(listDocRef)
                if (!list.exists()) throw `The specified list doesn't exist`
                
                const movies = list.data().movies
                const movieToRemove = movies.find(entry => entry.imdbID === movieID)

                try {
                    if (movieToRemove) {
                        await transaction.update(listDocRef, {
                            movies: arrayRemove(movieToRemove)
                        })
                        console.log(`Success! The movie ${movieID} was removed from list ${listPath}`)
                    }
                    else {
                        throw `The specified movie wasn't found on this list`
                    }
                }
                catch (e) {
                    console.error(`Couldn't remove the movie ${movieID} from list ${listPath} because: ${e}`)
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
    const auth = getAuth(app)

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
        doc
    }
}

export const db = await Db()