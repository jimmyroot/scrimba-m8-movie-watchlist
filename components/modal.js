// A straightforward modal using the dialog tag

const Modal = () => {
  // Generic click handler
  const handleClick = (e) => {
    const execute = {
      hide: () => {
        hide()
      },
    }

    const { type } = e.target.dataset
    // If there's a method in our object literal 'execute' for 'type' then run that,
    // else check if the user clicked outside the message box and if so, close
    // the dialog
    if (execute[type]) {
      execute[type]()
    } else {
      if (e.target.tagName === 'DIALOG') hide()
    }
  }

  // Render the dialog inner html with whatever message we passed in
  const render = (msg) => {
    let html = `
      <div id="modal__inner" class="modal__inner">
        <p><i class='bx bxs-error-circle bx-md'></i></p>
        <p class="modal__p">${msg}</p>
        <button class="modal__btn" data-type="hide">Close</button>
      </div>
    `
    return html
  }

  // Refresh the inner html of the dialog
  const refresh = (msg) => {
    node.innerHTML = render(msg)
  }

  // Show the dialog as a modal
  const show = (msg) => {
    refresh(msg)
    node.showModal()
  }

  // Hide the modal
  const hide = () => {
    node.close()
  }

  const get = () => {
    return node
  }

  // Initialize the module. In this module, 'node' is a dialog element
  // so we can use node.showModal, node.close, etc to do what we want
  const node = document.createElement('dialog')
  node.classList.add('modal')
  node.id = 'modal'
  refresh('Oh no, something went wrong! Please try again later.')

  // Add event listener
  node.addEventListener('click', handleClick)

  return {
    get,
    show,
  }
}

export const modal = Modal()
