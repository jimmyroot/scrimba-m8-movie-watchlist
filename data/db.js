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

    const createList = async params => {
        const lists = collection(db, 'lists')
        const listDocRef = await addDoc(lists, {
            uid: params.uid,
            title: 'My Sci-Fi list',
            createdAt: serverTimestamp(),
            movies: []
        })
    }

    // Convert this to a transaction based function
    const addMovie = async movie => {

        try {
            const moviesRef = collection(db, 'movies')
            
        }
        catch (e) {
            console.log(`The add movie transaction failed. The error was: ${e}`)
        }

        // if (!await getMovie(movie.imdbID)) {
        //     const fullMovieData = await omdb.getMovieByIMDBId(movie.imdbID)
        //     const movieDocRef = doc(db, 'movies', movie.imdbID)
        //     await setDoc(movieDocRef, fullMovieData)
        // }
    }

    const addMovieToList = async (listID, movie) => {

        try {
            await runTransaction(db, async (transaction) => {
                const listDocRef = doc(db, 'lists', listID)
                const list = await transaction.get(listDocRef)
                if (!list.exists()) {
                    throw "List not found!"
                }

                const movies = list.data().movies
                const movieExists = movies.find(entry => entry.imdbID === movie.imdbID)

                // If the movie doesn't exist
                if (!Boolean(movieExists)) {
                    const now = Timestamp.now()
                    const newEntry = {
                        imdbID: movie.imdbID,
                        watched: false,
                        addedAt: now,
                        comments: null
                    }

                    transaction.update(listDocRef, {
                        movies: arrayUnion(newEntry)
                    })
                    console.log('The add movie transaction completed successfully')
                }
                else {
                    console.log('The movie already exists in the list.')
                }

                
            })
        
        }
        catch (e) {
            console.error('Add movie transaction failed. The error was: ', e)
        }
        // const now = Timestamp.now()
        // const listDocRef = doc(db, 'lists', listID)

        // const movieEntry = {
        //     imdbID: movie.imdbID,
        //     watched: false,
        //     addedAt: now,
        //     comments: null
        // }
       
        // await updateDoc(listDocRef, {
        //     movies: arrayUnion(movieEntry)
        // })
        // // console.log(movie)
    }

    const removeMovieFromList = async (listID, movie) => {
        // check if the list contains the movie we want to remove
        // remove the movie using arrayRemove (the object)

        try {
            await runTransaction(db, async (transaction) => {
                const listDocRef = doc(db, 'lists', listID)
                const list = await transaction.get(listDocRef)
                if (!list.exists()) {
                    throw "List not found!"
                }

                const movies = list.data().movies
                console.log(movies)
            })
            console.log('Movie successfully deleted!')
        }
        catch (e) {
            console.error('Transaction failed:', e)
        }

        const listDocRef = doc(db, 'lists', listID)

        await updateDoc(listDocRef, {
            movies: arrayRemove(movie)
        })
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
        addMovie,
        addMovieToList,
        removeMovieFromList
    }
}

export const db = Db()