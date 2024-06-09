// import { router } from '../pages/router'
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


const Auth = () => {

    const fbSignIn = async ( email, password ) => {
        const user = await signInWithEmailAndPassword(auth, email, password)
    }

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, google)
        // const credential = GoogleAuthProvider.credentialFromResult(result)
        // const token = credential.accessToken
        const user = result.user
        // console.log(user.uid)
        const profile = await db.getAccount(user.uid)
        Boolean(profile) ? console.log('exists') : db.createAccount(user)
    }

    const fbSignOut = () => {
        try { 
            signOut(auth)
        }
        catch (error) {
            console.error(`Error signing out. The error was: ${error}`)
        }
    }

    const watchAuthState = () => {
        onAuthStateChanged(auth, user => {
            if (user) {
                // console.log(`User ${user.email} is logged in`)
                // router.navigate(location.pathname)
            }
            else {
                // console.log('User is logged out')
                // router.navigate('/')
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

    // watchAuthState()

    return {
        get,
        fbSignIn,
        fbSignOut,
        signInWithGoogle,
        getUser,
        watchAuthState,
        onAuthStateChanged
        
    }
}

export const auth = Auth()