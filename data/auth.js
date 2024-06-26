// import { router } from '../pages/router'
import { 
    getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'

const db = await (async () => {
    const { db } = await import('./db')
    return db
})()

const Auth = () => {

    const fbCreateUserAndSignIn = async ( newUser ) => {
        try {
            if (!newUser) throw 'newUser object missing'
            const credential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
            await updateProfile(credential.user, {
                displayName: `${newUser.givenName} ${newUser.familyName}`
            })
            db.createAccount(credential.user)
        }
        catch (e) {
            console.error(`User could not be created. Error code and message were: ${e.code}, ${e.message}`)
        }
    }

    const fbSignIn = async ( email, password ) => {
        const user = await signInWithEmailAndPassword(auth, email, password)
    }

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, google)
            const user = result.user
            const profile = await db.getAccount(user.uid)
            if (!Boolean(profile)) db.createAccount(user)
        }
        catch (e) {
            if (e.code === 'auth/account-exists-with-different-credential') {
                console.error(`An account is already registered using either an alternate provider, or email & password.`)            }
        }
    }

    const signInWithGithub = async () => {
        try {
            const result = await signInWithPopup(auth, github)
            const user = result.user
            const profile = await db.getAccount(user.uid)
            if (!Boolean(profile)) db.createAccount(user)
        }
        catch (e) {
            console.error(e)
            if (e.code === 'auth/account-exists-with-different-credential') {
                console.error(`An account is already registered using either an alternate provider, or email & password.`)
            }
        }
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
                console.log(`User ${user.email} is logged in`)
                // router.navigate(location.pathname)
            }
            else {
                console.log('User is logged out')
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
    const github = new GithubAuthProvider()

    // watchAuthState()

    return {
        get,
        fbCreateUserAndSignIn,
        fbSignIn,
        fbSignOut,
        signInWithGoogle,
        signInWithGithub,
        getUser,
        watchAuthState,
        onAuthStateChanged
    }
}

export const auth = Auth()