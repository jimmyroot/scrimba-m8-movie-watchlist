// ShowError takes an element, and a msg
// Appends a warning message to the element specified
// Message removes itself after 6 secs

const showError = (el, msg) => {
    const p = document.createElement('p')
    p.classList.add('form__warning-msg')
    p.innerHTML = `
        <i class='bx bx-x-circle'></i>
        <span>${msg}</span<
    `
    el.after(p)
    setTimeout(() => {
        p.remove()
    }, 6000)
}

// Set the input state; takes an element and an 'errPayload' object
const setInputState = (el, errPayload) => {
    const { resetState, valid, msg } = errPayload

    // Check reset state and action it if 'true'
    if (resetState) {
        if (el.classList.contains('warning')) el.classList.remove('warning')
        if (el.classList.contains('valid')) el.classList.remove('valid')
        const msgEl = el.closest('.form__input-container').querySelector('.form__warning-msg')
        if (msgEl) msgEl.remove()
    }
    // Else continue and update 
    else {
        const currInputContainer = el.closest('.form__input-container')
        const msgEl = currInputContainer.querySelector('.form__warning-msg')
        
        // Add the relevant state class to the el
        const stateClass = valid ? 'valid' : 'warning'
        el.classList.remove('valid', 'warning')
        el.classList.add(stateClass)

        // Build an error msg, similar to show error function except we don't
        // want this one to disappear after 6 seconds
        const p = document.createElement('p')
        p.classList.add('form__warning-msg')
        p.innerHTML = `
            <i class='bx bx-x-circle'></i>
            <span>${msg}</span<
        `
        
        // If input is invalid, show or update the error message
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

// Run validation for all elements in the form, as long as the element
// isn't the submit button 
const validateForm = (form, validateInput) => {
    const formEls = [...form.elements]

    formEls.forEach(input => {
        if (input.type !== 'submit') validateInput(input)
    })

    for (const el of formEls) {
        if (el.classList.contains('warning')) return false
    }

    return true
}

export {
    showError,
    setInputState,
    validateForm
}