// signin.js — Sign in page

import { auth } from '../data/auth'
import * as utils from '../utils/utils'
import { setInputState, validateForm } from '../utils/forms'
import { modal } from '../components/modal'

const SignIn = () => {
  // Click handlers
  const handleClick = (e) => {
    const execute = {
      signin: async () => {
        e.preventDefault()
        const form = e.target.closest('form')
        if (form) handleSignIn(form)
      },
      signinwithgoogle: () => {
        auth.signInWithGoogle()
      },
      signinwithgithub: () => {
        auth.signInWithGithub()
      },
    }

    const { type } = e.target.dataset
    if (execute[type]) execute[type]()
  }

  // Page content
  const render = () => {
    const html = `
            <section class="page__container page__container-small">
                <h1>Sign in</h1>
                <form id="signin-form">
                    <div class="form__input-container">
                        <label class="form__label" for="login-email">Email</label>
                        <input class="form__input" type="text" name="login-email" id="login-email" autocomplete="username" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="login-password">Password</label>
                        <input class="form__input" type="password" name="login-password" id="login-password" autocomplete="current-password"/>
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

  // Validate input fields
  const validateInput = (input) => {
    // Object literal containing our validation rules, so
    // we can call validate[input-id]() to run the validation,
    // very convenient!!!
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
      },
    }

    const { id } = input
    const form = input.closest('form')
    // This is a slick way to convert the form fields/values into a nice
    // object we can use destructuring on
    const formData = Object.fromEntries(
      Object.values(form).map((el) => [el.name, el.value])
    )
    const el = node.querySelector(`#${id}`)
    let valid = null
    let msg = null
    let resetState = false

    const { 'login-email': loginEmail, 'login-password': loginPassword } =
      formData

    // Check if we have a validation rule for the input's id; if so run the validation
    if (validate[id]) validate[id]()

    // make a little object with error info, we can also reset the
    // validation state (e.g. remove all visual indicators)
    let errPayload = {
      resetState: resetState,
      valid: valid,
      msg: msg,
    }

    // call setInputState with an element to work on, and
    // the details of the err or not
    setInputState(el, errPayload)
  }

  const handleSignIn = async (form) => {
    if (window.navigator.onLine === true) {
      if (validateForm(form, validateInput)) {
        node.classList.add('spinner', 'dimmed')
        const email = document.getElementById('login-email').value
        const password = document.getElementById('login-password').value
        await auth.fbSignIn(email, password)
      }
    } else {
      if (modal)
        modal.show('You appear to be offline. Please re-connect and try again.')
    }
  }

  // Update this page, remove a spinner if there's one present
  const refresh = () => {
    if (node.classList.contains('spinner'))
      node.classList.remove('spinner', 'dimmed')
    node.innerHTML = render()
  }

  const get = () => {
    refresh()
    node.append(modal.get())
    return node
  }

  // Init module
  const node = document.createElement('main')
  node.classList.add('main')

  // Add listeners
  node.addEventListener('click', handleClick)
  node.addEventListener('input', (e) => validateInput(e.target))

  return {
    get,
  }
}

export const signIn = SignIn()
