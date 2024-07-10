import { auth } from '../data/auth'

const SignIn = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
    }

    const handleClick = e => {
        const execute = {
            'signin': () => {
                const email = document.getElementById('login-email').value
                const password = document.getElementById('login-password').value
                auth.fbSignIn(email, password)
            },
            'signinwithgoogle': () => {
                auth.signInWithGoogle()
            },
            'signinwithgithub': () => {
                auth.signInWithGithub()
            }
        }

        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const render = () => {
        const html = `
            <section class="page__container page__container-small">
                <h1>Sign in</h1>
                <div>
                    <input type="text" id="login-email" />
                    <input type="password" id="login-password" />
                    <button type="submit" data-type="signin">Sign in</button>
                </div>
                <div>
                    <button data-type="signinwithgoogle">Continue with Google</button>
                    <button data-type="signinwithgithub">Continue with Github</button>
                </div>
            </section>
        `
        return html
    }

    const refresh = () => {
        node.innerHTML = render()
    }

    const get = () => {
        refresh()
        return node
    }

    const node = document.createElement('main')
    node.classList.add('main')
    registerEventListeners()

    return {
        get
    }
}

export const signIn = SignIn()