const db = await (async () => {
    const { db } = await import('./data/db')
    return db
})()

import { auth } from './data/auth'
import { router } from './pages/router'

router.renderStartPage()

// document.querySelector('#login').addEventListener('click', () => {
//   const email = document.querySelector('#email').value
//   const password = document.querySelector('#password').value
//   auth.login(email, password)
// })

// document.querySelector('#login-google').addEventListener('click', () => {
//   auth.loginWithGoogle()
// })

// document.querySelector('#logout').addEventListener('click', () => {
//   auth.logout()
// })