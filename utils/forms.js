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
    }, 10000)
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