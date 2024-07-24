// signup.js — page for signing up to an email based account

import { auth } from '../data/auth'
import * as utils from '../utils/utils'
import { setInputState, validateForm } from '../utils/forms'
import { router } from './router'

const SignUp = () => {

    const handleClick = e => {
        const execute = {
            'signup': async () => {
                const form = e.target.closest('form')
                if (validateForm(form, validateInput)) {
                    node.classList.add('spinner', 'dimmed')
                    const formData = Object.fromEntries(Object.values(form).map(el => [el.name, el.value]))
                    const { 
                        'given-name': givenName,
                        'family-name': familyName,
                        email,
                        password
                    } = formData

                    const newUser = {
                        'givenName': givenName,
                        'familyName': familyName,
                        'email': email,
                        'password': password
                    }

                    await auth.fbCreateUserAndSignIn(newUser)
                }
            },
            'navigate': () => {
                const { pathname } = e.target
                router.navigate(pathname)
            }
        }

        e.preventDefault()
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const validateInput = input => {
        const validate = {
            'given-name': () => {
                valid = givenName && utils.validateName(givenName) ? true : false
                if (!valid) {
                    if (!givenName) {
                        msg = 'First name is required'
                    }
                    else {
                        msg = 'Must start, end with and only contain letters'
                    }
                }
            },
            'family-name': () => {
                if (!familyName) {
                    resetState = true
                } else {
                    valid = utils.validateName(familyName) ? true : false
                    if (!valid) {
                       msg = 'Must start, end with and only contain letters'
                    }
                }
            },
            'email': () => {
                valid = email && utils.validateEmail(email) ? true : false
                if (!valid) {
                    msg = !email ? 'Email is required' : 'Email address not valid'
                }
            },
            'password': () => {
                valid = password.length >= 6
                if (!valid) {
                    msg = 'Password must be at least 6 characters'
                }
                validateInput(node.querySelector('#password-confirm'))
            },
            'password-confirm': () => {
                valid = passwordConfirm === password ? true : false
                if (!valid) {
                    msg = 'Passwords do not match'
                } else if (!passwordConfirm) {
                    resetState = true
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

        const {
            'given-name': givenName,
            'family-name': familyName,
            email,
            password,
            'password-confirm': passwordConfirm
        } = formData

        if (validate[id]) validate[id]()
        let errPayload = {
            resetState: resetState,
            valid: valid,
            msg: msg,
        }
        setInputState(el, errPayload)
    }

    const render = () => {
        const html = `
            <section class="page__container page__container-small">
                <h1>We just need a few details to create your membership</h1>
                <p class="signup__p">Don't worry, this won't take long (and it's free!). We'll have you 
                signed up in no time 🙃
                <form id="signup-form">
                    <div class="form__input-container">
                        <label class="form__label" for="given-name">First name</label>
                        <input class="form__input" type="text" name="given-name" id="given-name" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="family-name">Last name</label>
                        <input class="form__input" type="text" name="family-name" id="family-name" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="email">Email</label>
                        <input class="form__input" type="text" name="email" id="email" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="password">Password</label>
                        <input class="form__input" type="password" name="password" id="password" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="password-confirm">Confirm password</label>
                        <input class="form__input" type="password" name="password-confirm" id="password-confirm" />
                    </div>
                    <button class="form__btn" data-type="signup">Sign Up</button>
                </form>
            </section>
        `
        return html
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
    node.classList.add('main')

    // // Update the content 
    // refresh()

    node.addEventListener('click', handleClick)
    node.addEventListener('input', e => validateInput(e.target))

    return {
        get
    }
}

export const signUp = SignUp()