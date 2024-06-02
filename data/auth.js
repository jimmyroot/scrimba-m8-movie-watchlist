import { 
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'

const db = await (async () => {
    const { db } = await import('./db')
    return db
})()

import { router } from '../pages/router'

const Auth = () => {

    const fbSignIn = async ( email, password ) => {
        const user = await signInWithEmailAndPassword(auth, email, password)
    }

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, google)
        // const credential = GoogleAuthProvider.credentialFromResult(result)
        // const token = credential.accessToken
        const user = result.user
    }

    const fbSignOut = () => {
        try { 
            signOut(auth)
        }
        catch (error) {
            console.error(`Error signing out. The error was: ${error}`)
        }
    }

    const watchAuthState = auth => {
        onAuthStateChanged(auth, user => {
            if (user) {
                console.log(`User ${user.email} is logged in`)
                router.navigate('/mylists')
            }
            else {
                console.log('User is logged out')
                router.navigate('/')
            }
        })
    }

    const get = () => {
        return auth
    }

    const getUser = () => {
        return auth.currentUser || null
    }

    const auth = getAuth(db.get())
    const google = new GoogleAuthProvider()
    
    watchAuthState(auth)

    return {
        get,
        fbSignIn,
        fbSignOut,
        signInWithGoogle,
        getUser
    }
}

export const auth = Auth()