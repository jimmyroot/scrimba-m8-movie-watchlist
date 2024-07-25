// Auth module, contains all of our Firebase auth code & functions
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
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'

import { db } from './db'
import { showError } from '../utils/forms'

const Auth = () => {
  // This function takes a newUser object as an argument and tries to create a
  // new user in Firebase with it
  const fbCreateUserAndSignIn = async (newUser) => {
    try {
      // Check we actually have a new user object
      if (!newUser) throw 'newUser object missing'

      // Try and create the user
      const credential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      )

      // Update the displayname in the new profile
      await updateProfile(credential.user, {
        displayName: `${newUser.givenName} ${newUser.familyName}`,
      })

      // Create a profile in our firestore db for the user
      await db.createAccount(credential.user)
    } catch (e) {
      // Show any errors. showError is a little function that appends an error somewhere
      // on the page
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
    }
  }

  // Sign in function, wrapper for firebase sign in with email/password account
  const fbSignIn = async (email, password) => {
    // Try to sign in and display any errors
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
    } catch (e) {
      const el = document.querySelector('#signin-form')
      document.querySelector('.main').classList.remove('spinner', 'dimmed')

      if (e.code === 'auth/invalid-credential') {
        showError(el, 'Email address and password not recognized')
      } else if (e.code === 'auth/too-many-requests') {
        const msg = 'Account locked! Try again later...'
        showError(el, msg)
      } else {
        const msg = e.code
        showError(el, msg)
      }
    }
    // do anything we need with credential here in future
  }

  // Initiate sign in with Google account
  const signInWithGoogle = async (showError) => {
    try {
      const credential = await signInWithPopup(auth, google)
      const user = credential.user
      const profile = await db.getAccount(user.uid)
      if (!Boolean(profile)) db.createAccount(user)
    } catch (e) {
      const el = document.querySelector('#signin-alt-btn-container')

      if (e.code === 'auth/account-exists-with-different-credential') {
        const msg = 'Email address already in use with an alternate provider.'
        showError(el, msg)
      } else {
        const msg = e.code
        showError(el, msg)
      }
    }
  }

  // Initiate sign in with Github
  const signInWithGithub = async () => {
    try {
      const credential = await signInWithPopup(auth, github)
      const user = credential.user
      const profile = await db.getAccount(user.uid)
      if (!Boolean(profile)) db.createAccount(user)
    } catch (e) {
      const el = document.querySelector('#signin-alt-btn-container')

      if (e.code === 'auth/account-exists-with-different-credential') {
        const msg = 'Email address already in use with an alternate provider.'
        showError(el, msg)
      } else {
        const msg = e.code
        showError(el, msg)
      }
    }
  }

  // Signout function, currently error output just goes to the console
  const fbSignOut = () => {
    try {
      signOut(auth)
    } catch (error) {
      console.error(`Error signing out. The error was: ${error}`)
    }
  }

  // This function initiates an onAuthStateChanged listener, was used just for testing
  // if login/logout was working and logs the result to the console
  const watchAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(`User ${user.email} is logged in`)
        // router.navigate(location.pathname)
      } else {
        console.log('User is logged out')
        // router.navigate('/')
      }
    })
  }

  // Return the auth object
  const get = () => {
    return auth
  }

  // Return the user or null if there isn't one
  const getUser = () => {
    return auth.currentUser || null
  }

  // Set up providers
  const auth = getAuth(db.get())
  const google = new GoogleAuthProvider()
  const github = new GithubAuthProvider()

  return {
    get,
    fbCreateUserAndSignIn,
    fbSignIn,
    fbSignOut,
    signInWithGoogle,
    signInWithGithub,
    getUser,
    watchAuthState,
    onAuthStateChanged,
  }
}

export const auth = Auth()
