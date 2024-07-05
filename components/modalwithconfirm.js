const ModalWithConfirm = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
    }

    const handleClick = e => {
        const execute = {
            'hide': () => {
                hide()
            },
            'yes': () => {
                hide('yes')
            },
            'no': () => {
                hide('no')
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
                <div class="modal__btn-container">
                    <button class="modal__btn" data-type="yes">Yes</button>
                    <button class="modal__btn" data-type="no">No</button>
                </div>
            </div>
        `
        return html
    }

    const refresh = msg => {
        node.innerHTML = render(msg)
    }

    const show = async msg => {
        refresh(msg)
        node.showModal()
        document.addEventListener('click', handleClick)

        return new Promise((resolve, reject) => {
            node.addEventListener('close', () => {
                resolve(node.returnValue)
            }, { once: true })
        })
    }

    const hide = confirmed => {
        node.close(confirmed)
    }

    const get = () => {
        refresh()
        return node
    }

    const node = document.createElement('dialog')
    node.classList.add('modal')
    node.id = 'modal-confirm'
    registerEventListeners()

    return {
        get,
        show
    }
}

export const modalWithConfirm = ModalWithConfirm()