import { auth } from '../data/auth'
import * as utils from '../utils/utils'
import { setInputState, validateForm } from '../utils/forms'

const SignIn = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
        node.addEventListener('input', e => {
            validateInput(e.target)
        })
    }

    const handleClick = e => {
        const execute = {
            'signin': async () => {
                e.preventDefault()
                const form = e.target.closest('form')
                if (validateForm(form, validateInput)) {
                    node.classList.add('spinner', 'dimmed')
                    const email = document.getElementById('login-email').value
                    const password = document.getElementById('login-password').value
                    await auth.fbSignIn(email, password)
                }
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
                <form id="signin-form">
                    <div class="form__input-container">
                        <label class="form__label" for="login-email">Email</label>
                        <input class="form__input" type="text" name="login-email" id="login-email" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="login-password">Password</label>
                        <input class="form__input" type="password" name="login-password" id="login-password" />
                    </div>
                    <button class="form__btn" type="submit" data-type="signin">Sign in</button>
                </form>
                <div class="page__divider-container">
                    <span class="page__divider"></span>
                    <span>or</span>
                    <span class="page__divider"></span>
                </div>
                <div id="signin-alt-btn-container" class="page__btn-container">
                    <button class="signin__alt-provider-btn" data-type="signinwithgoogle">
                        <i class='bx bxl-google bx-sm'></i>
                        Continue with Google
                    </button>
                    <button class="signin__alt-provider-btn" data-type="signinwithgithub">
                        <i class='bx bxl-github bx-sm' ></i>
                        Continue with Github
                    </button>
               </div>
            </section>
        `
        return html
    }

    const validateInput = input => {
        const validate = {
            'login-email': () => {
                valid = loginEmail && utils.validateEmail(loginEmail) ? true : false
                if (!valid) {
                    msg = !loginEmail ? 'Email is required' : 'Email address not valid'
                }
            },
            'login-password': () => {
                valid = Boolean(loginPassword)
                if (!valid) {
                    msg = 'Password field should not be empty'
                }
            }
        }

        const { id } = input
        const form = input.closest('form')
        const formData = Object.fromEntries(Object.values(form).map(el => [el.name, el.value]))
        const el = node.querySelector(`#${id}`)
        let valid = null
        let msg = null
        let resetState = false

        const { 'login-email': loginEmail, 'login-password': loginPassword } = formData

        if (validate[id]) validate[id]()

        let errPayload = {
            resetState: resetState,
            valid: valid,
            msg: msg,
        }
        setInputState(el, errPayload)
    }

    const refresh = () => {
        if (node.classList.contains('spinner')) node.classList.remove('spinner', 'dimmed')
        node.innerHTML = render()
    }

    const get = () => {
        refresh()
        return node
    }

    const node = document.createElement('main')
    registerEventListeners()
    node.classList.add('main')

    return {
        get
    }
}

export const signIn = SignIn()