import { auth } from '../data/auth'
import * as utils from '../utils/utils'

const SignUp = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
        node.querySelector('#signup-form').addEventListener('change', e => {
            if (e.target.classList.contains('warning')) e.target.classList.remove('warning')
        })
    }

    const handleClick = e => {

        const execute = {
            'signup': () => {
                const form = e.target.closest('form')
                if (validateSignUpForm(form)) {
                    const formData = Object.fromEntries(Object.values(form).map(el => [el.name, el.value]))
                    const { givenname, familyname, email, password } = formData
                    const newUser = {
                        'givenName': givenname,
                        'familyName': familyname,
                        'email': email,
                        'password': password
                    }
                    auth.fbCreateUserAndSignIn(newUser)
                } 

                // const form = e.target.closest('form')
                // const formData = Object.fromEntries(Object.values(form).map(el => [el.name, el.value]))
                // const { givenname, familyname, email, password, passwordconfirm } = formData
            }
        }

        e.preventDefault()
        const { type } = e.target.dataset
        if (execute[type]) execute[type]()
    }

    // Could probably tidy this up a bit, lots of selectors that could be consolidated
    const validateSignUpForm = form => {
        const formData = Object.fromEntries(Object.values(form).map(el => [el.name, el.value]))
        const { givenname, familyname, email, password, passwordconfirm } = formData

        if (!givenname || !utils.validatePlainText(givenname)) node.querySelector('#givenname').classList.add('warning')
        if (!familyname || !utils.validatePlainText(familyname)) node.querySelector('#familyname').classList.add('warning')
        if (!utils.validateEmail(email)) node.querySelector('#email').classList.add('warning')

        if (password.length >= 6 && passwordconfirm.length >= 6) {
            if (!utils.validatePassword(password, passwordconfirm)) {
                node.querySelector('#passwordconfirm').classList.add('warning')
            } else {
                node.querySelector('#passwordconfirm').classList.remove('warning')
            }
        } else {
            node.querySelectorAll('[id^=password]').forEach(el => {
                if (el.value.length < 6) {
                    el.classList.add('warning')
                }
            })
        }

        for (const el of [...form.elements]) {
            if (el.classList.contains('warning')) return false
        }

        return true
    }

    const render = () => {
        const html = `
            <h1>Sign up</h1>
            <form id="signup-form">
                <label for="givenname">First name
                    <input type="text" name="givenname" id="givenname" />
                </label>
                <label for="familyname">Last name
                    <input type="text" name="familyname" id="familyname" />
                </label>
                <label for="email">Email
                    <input type="text" name="email" id="email" />
                </label>
                <label for="password">Password
                    <input type="password" name="password" id="password" />
                </label>
                <label for="passwordconfirm">Confirm password
                    <input type="password" name="passwordconfirm" id="passwordconfirm" />
                </label>
                <button data-type="signup">Sign Up</button>
            </form>
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