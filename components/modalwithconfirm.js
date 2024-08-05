// Modal with confirm — similar to modal module but has yes no
// and returns the users answer

const ModalWithConfirm = () => {

  // Click handler - if user clicks yes or no, call the hide function and
  // pass the value, this will in turn call close(value) so the calling
  // page can retrieve the value and act accordingly
  const handleClick = e => {
    const execute = {
      hide: () => {
        hide()
      },
      yes: () => {
        hide('yes')
      },
      no: () => {
        hide('no')
      },
    }

    const { type } = e.target.dataset

    // as with the other modal, close it if the user clicks outside the main
    // dialog box
    if (execute[type]) {
      execute[type]()
    } else {
      if (e.target.tagName === 'DIALOG') hide()
    }
  }

  // Render function, nothing special here
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

  // Refresh function
  const refresh = msg => {
    node.innerHTML = render(msg)
  }

  // Show function; takes a msg string to display in the modal
  const show = async msg => {
    refresh(msg)
    node.showModal()
    document.addEventListener('click', handleClick)

    // Returns a promise that resolves to the users choice (returnValue)
    // Sets up an event listener that fires when the modal is closed and resolves
    // the promise to the returnValue
    return new Promise((resolve, reject) => {
      node.addEventListener(
        'close',
        () => {
          resolve(node.returnValue)
        },
        { once: true }
      )
    })
  }

  // Close the modal and set return value
  const hide = confirmed => {
    node.close(confirmed)
  }

  // Returns the node so it can be added to the DOM
  const get = () => {
    refresh()
    return node
  }

  // Initialize our modal
  const node = document.createElement('dialog')
  node.classList.add('modal')
  node.id = 'modal-confirm'
  node.addEventListener('click', handleClick)

  return {
    get,
    show,
  }
}

export const modalWithConfirm = ModalWithConfirm()
