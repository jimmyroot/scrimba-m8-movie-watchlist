import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js'
import { getFirestore, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js'

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

    const createAccount = async user => {
        console.log(`Creating account with UID: ${user.uid}`)
        // set the new doc inside profiles
    }

    const get = () => {
        return app
    }

    const app = await initDB()
    const db = await getFirestore(app)

    return {
        get,
        getAccount,
        createAccount
    }
}

export const db = Db()