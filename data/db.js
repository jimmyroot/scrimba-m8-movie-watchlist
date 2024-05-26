import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js'

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

    const get = () => {
        return app
    }

    const app = await initDB()

    return {
        get
    }
}

export const db = Db()