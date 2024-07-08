import { auth } from '../data/auth'
import * as utils from '../utils/utils'

const SignUp = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
        node.querySelector('#signup-form').addEventListener('keyup', e => {
            validateInput(e.target)
            // validateSignUpForm(e.target.closest())
        })
    }

    const handleClick = e => {
        const execute = {
            'signup': async () => {
                const form = e.target.closest('form')
                if (validateSignUpForm(form)) {
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
            }
        }

        e.preventDefault()
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    const validateInput = input => {
        const validate = {
            'given-name': () => {
                state = givenName && utils.validatePlainText(givenName) ? true : false
            },
            'family-name': () => {
                state = familyName && utils.validatePlainText(familyName) ? true : false
            },
            'email': () => {
                state = email && utils.validateEmail(email) ? true : false
            },
            'password': () => {
                state = password.length >= 6 ? true : false
            },
            'password-confirm': () => {
                state = passwordConfirm.length >= 6 && passwordConfirm === password ? true : false
            }
        }

        const { id } = input
        const form = input.closest('form')
        const formData = Object.fromEntries(Object.values(form).map(el => [el.name, el.value]))
        const el = node.querySelector(`#${id}`)
        let state = null
        const { 
            'given-name': givenName,
            'family-name': familyName,
            email,
            password,
            'password-confirm': passwordConfirm
        } = formData
        if (validate[id]) validate[id]()
        setInputState(el, state)
    }

    const setInputState = (el, valid) => {
        const stateClass = valid ? 'valid' : 'warning'
        el.classList.remove('valid', 'warning')
        el.classList.add(stateClass)
    }

    // Could probably tidy this up a bit, lots of selectors that could be consolidated
    const validateSignUpForm = form => {
        const formEls = [...form.elements]

        formEls.forEach(input => {
            if (input.type !== 'submit') validateInput(input)
        })

        for (const el of formEls) {
            if (el.classList.contains('warning')) return false
        }

        return true
    }

    const render = () => {
        const html = `
            <section class="page__container-small">
                <h1>We just need a few details to create your membership</h1>
                <p>Don't worry, this won't take long (and it's free!). We'll have you 
                signed up in no time 🙃</p>
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
        node.innerHTML = render()
    }

    const get = () => {
        refresh()
        registerEventListeners()
        return node
    }

    const node = document.createElement('main')
    node.classList.add('main')

    return {
        get
    }
}

export const signUp = SignUp()