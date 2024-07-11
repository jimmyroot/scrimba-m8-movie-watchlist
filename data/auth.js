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

import { db } from './db'
import { showError } from '../utils/forms'

const Auth = () => {

    const fbCreateUserAndSignIn = async ( newUser ) => {
        try {
            if (!newUser) throw 'newUser object missing'
            const credential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
            await updateProfile(credential.user, {
                displayName: `${newUser.givenName} ${newUser.familyName}`
            })
            await db.createAccount(credential.user)
        }
        catch (e) {
            if (e.code === 'auth/email-already-in-use') {
                const el = document.querySelector('#email')
                showError(el, 'Email address already in use')
            } else {
                if (e.code === 'auth/email-already-in-use') {
                    const el = document.querySelector('#signup-form')
                    const msg = e.code
                    showError(el, msg)
                }
            }
            // console.error(`User could not be created. Error code and message were: ${e.code}, ${e.message}`)
        }
    }

    const fbSignIn = async ( email, password ) => {
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password)
        } catch (e) {
            const el = document.querySelector('#signin-form')
            
            if (e.code === 'auth/invalid-credential') {
                showError(el, 'Email address and password not recognized')
            }
            else if (e.code === 'auth/too-many-requests') {
                const msg = 'Account locked! Try again later...'
                showError(el, msg)
            } else {
                const msg = e.code
                showError(el, msg)
            }
        }
        // do anything we need with credential here in future 
    }

    const signInWithGoogle =  async showError  => {
        try {
            const credential = await signInWithPopup(auth, google)
            const user = credential.user
            const profile = await db.getAccount(user.uid)
            if (!Boolean(profile)) db.createAccount(user)
        }
        catch (e) {
            const el = document.querySelector('#signin-alt-btn-container')

            if (e.code === 'auth/account-exists-with-different-credential') {
                const msg = 'Email address already in use with an alternate provider.'
                showError(el, msg)
                // console.error(`An account is already registered using either an alternate provider, or email & password.`)            
            } else {
                const msg = e.code
                showError(el, msg)
            }
        }
    }

    const signInWithGithub = async () => {
        try {
            const credential = await signInWithPopup(auth, github)
            const user = credential.user
            const profile = await db.getAccount(user.uid)
            if (!Boolean(profile)) db.createAccount(user)
        }
        catch (e) {
            const el = document.querySelector('#signin-alt-btn-container')

            if (e.code === 'auth/account-exists-with-different-credential') {
                const msg = 'Email address already in use with an alternate provider.'
                showError(el, msg)
                // console.error(`An account is already registered using either an alternate provider, or email & password.`)            
            } else {
                const msg = e.code
                showError(el, msg)
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