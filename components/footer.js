// FOOTER: Simplest module in the whole project, and shows the basic
// template on which all other modules are based. The main element (I
// always refer to it as simply "node" is created when the module is
// imported. There is a get fuction that returns the module, a refresh
// function which can be called to re-render the inner contents of node,
// and a render function which is where we construct the actual contents
// of node.

const Footer = () => {
  const render = () => {
    const html = `
            <p>Reel Talk</p>
            <p>Copyright Jimmy ©2024</p>
        `

    return html
  }

  const refresh = () => {
    node.innerHTML = render()
  }

  const get = () => {
    refresh()
    return node
  }

  const node = document.createElement('footer')
  node.classList.add('footer')

  return {
    get,
  }
}

export const footer = Footer()
