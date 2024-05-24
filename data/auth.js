import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'

const db = await (async () => {
    const { db } = await import('./db')
    return db
})()

const Auth = () => {

    const login = async ( email, password ) => {
        const user = await signInWithEmailAndPassword(auth, email, password)
        console.log(user)
    }

    const logout = async () => {
        signOut(auth)
    }

    const watchAuthState = auth => {
        onAuthStateChanged(auth, user => {
            if (user) {
                console.log(`User ${user.email} is logged in`)
            }
            else {
                console.log('User is logged out')
            }
        })
    }

    const auth = getAuth(db.get())

    watchAuthState(auth)

    return {
       login,
       logout
    }
}

export const auth = Auth()