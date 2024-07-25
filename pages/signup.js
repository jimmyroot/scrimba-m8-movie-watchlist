// signup.js — page for signing up to an email based account

import { auth } from '../data/auth'
import * as utils from '../utils/utils'
import { setInputState, validateForm } from '../utils/forms'
import { router } from './router'
import { modal } from '../components/modal'

const SignUp = () => {
  // Click handler
  const handleClick = (e) => {
    const execute = {
      signup: async () => {
        const form = e.target.closest('form')
        handleSignUp(form)
      },
      navigate: () => {
        const { pathname } = e.target
        router.navigate(pathname)
      },
    }

    e.preventDefault()
    const { type } = e.target.dataset
    if (execute[type]) execute[type]()
  }

  // A bigger and badder version of the validate function in signin.js
  // All the same comments apply here!
  const validateInput = (input) => {
    const validate = {
      'given-name': () => {
        valid = givenName && utils.validateName(givenName) ? true : false
        if (!valid) {
          if (!givenName) {
            msg = 'First name is required'
          } else {
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
      email: () => {
        valid = email && utils.validateEmail(email) ? true : false
        if (!valid) {
          msg = !email ? 'Email is required' : 'Email address not valid'
        }
      },
      password: () => {
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
      },
    }

    const { id } = input
    const form = input.closest('form')
    const formData = Object.fromEntries(
      Object.values(form).map((el) => [el.name, el.value])
    )
    const el = node.querySelector(`#${id}`)
    let valid = null
    let msg = null
    let resetState = false

    const {
      'given-name': givenName,
      'family-name': familyName,
      email,
      password,
      'password-confirm': passwordConfirm,
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
                        <input class="form__input" type="text" name="given-name" id="given-name" autocomplete="given-name" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="family-name">Last name</label>
                        <input class="form__input" type="text" name="family-name" id="family-name" autocomplete="family-name" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="email">Email</label>
                        <input class="form__input" type="text" name="email" id="email" autocomplete="email" />
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="password">Password</label>
                        <input class="form__input" type="password" name="password" id="password" autocomplete="new-password"/>
                    </div>
                    <div class="form__input-container">
                        <label class="form__label" for="password-confirm">Confirm password</label>
                        <input class="form__input" type="password" name="password-confirm" id="password-confirm" autocomplete="new-password" />
                    </div>
                    <button class="form__btn" data-type="signup">Sign Up</button>
                </form>
            </section>
        `
    return html
  }

  // Handle the signup process
  const handleSignUp = async (form) => {
    // If the form is valid
    if (validateForm(form, validateInput)) {
      // If the device is online
      if (window.navigator.onLine === true) {
        // Add spinner, get form data, destructure formData
        node.classList.add('spinner', 'dimmed')
        const formData = Object.fromEntries(
          Object.values(form).map((el) => [el.name, el.value])
        )
        const {
          'given-name': givenName,
          'family-name': familyName,
          email,
          password,
        } = formData

        // Create object representing new user
        const newUser = {
          givenName: givenName,
          familyName: familyName,
          email: email,
          password: password,
        }

        // Hand the new user object off to the auth module
        await auth.fbCreateUserAndSignIn(newUser)
      } else {
        if (modal)
          modal.show(`It looks like you're offline! Re-connect and try again.`)
      }
    }
  }

  // Refresh page content
  const refresh = () => {
    if (node.classList.contains('spinner'))
      node.classList.remove('spinner', 'dimmed')
    node.innerHTML = render()
  }

  // Get the node
  const get = () => {
    refresh()
    node.appendChild(modal.get())
    return node
  }

  // Init
  const node = document.createElement('main')
  node.classList.add('main')

  // Add event listeners
  node.addEventListener('click', handleClick)
  node.addEventListener('input', (e) => validateInput(e.target))

  return {
    get,
  }
}

export const signUp = SignUp()
