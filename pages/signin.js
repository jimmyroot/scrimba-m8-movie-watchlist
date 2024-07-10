import { auth } from '../data/auth'
import * as utils from '../utils/utils'

const SignIn = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
        node.querySelector('#signin-form').addEventListener('input', e => {
            validateInput(e.target)
        })
    }

    const handleClick = e => {
        const execute = {
            'signin': async () => {
                e.preventDefault()
                const form = e.target.closest('form')
                if (validateForm(form)) {
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
                <div>
                    <button data-type="signinwithgoogle">Continue with Google</button>
                    <button data-type="signinwithgithub">Continue with Github</button>
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

    const setInputState = (el, errPayload) => {
        const { resetState, valid, msg } = errPayload

        if (resetState) {
            if (el.classList.contains('warning')) el.classList.remove('warning')
            if (el.classList.contains('valid')) el.classList.remove('valid')
            const msgEl = el.closest('.form__input-container').querySelector('.form__warning-msg')
            if (msgEl) msgEl.remove()
        } else {
            const currInputContainer = el.closest('.form__input-container')
            const msgEl = currInputContainer.querySelector('.form__warning-msg')
            
            const stateClass = valid ? 'valid' : 'warning'
            el.classList.remove('valid', 'warning')
            el.classList.add(stateClass)
    
            const p = document.createElement('p')
            p.classList.add('form__warning-msg')
            p.innerHTML = `
                <i class='bx bx-x-circle'></i>
                <span>${msg}</span<
            `
            
            if (!valid) {
                if (!msgEl) { 
                    el.after(p)
                } else {
                    msgEl.replaceWith(p)
                }
            }
            else {
                if (msgEl) msgEl.remove()
            }
    
        }
        
        
    }

    const validateForm = form => {
        const formEls = [...form.elements]

        formEls.forEach(input => {
            if (input.type !== 'submit') validateInput(input)
        })

        for (const el of formEls) {
            if (el.classList.contains('warning')) return false
        }

        return true
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

export const signIn = SignIn()