const Modal = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
    }

    const handleClick = e => {
        const execute = {
            'hide': () => {
                hide()
            }
        }

        const { type } = e.target.dataset

        if (execute[type]) {
            execute[type]()
        }
        else {
            if (e.target.tagName === 'DIALOG') hide()
        }
    }

    const render = msg => {
        let html = `
            <div id="modal__inner" class="modal__inner">
                <p><i class='bx bxs-error-circle bx-md'></i></p>
                <p class="modal__p">${msg}</p>
                <button class="modal__btn-close" data-type="hide">Close</button>
            </div>
        `
        return html
    }

    const refresh = msg => {
        node.innerHTML = render(msg)
    }

    const show = msg => {
        refresh(msg)
        node.showModal()
        document.addEventListener('click', handleClick)
    }

    const hide = () => {
        node.close()
    }

    const get = () => {
        refresh()
        return node
    }

    const node = document.createElement('dialog')
    node.classList.add('modal')
    node.id = 'modal'
    registerEventListeners()

    return {
        get,
        show
    }
}

export const modal = Modal()