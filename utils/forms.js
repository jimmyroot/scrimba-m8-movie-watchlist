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

export {
    showError
}