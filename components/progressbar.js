// progressbar.js — a progress bar

const ProgressBar = () => {

    const render = () => {
      const html = `
          <label>
            <span class="sr-only">Movie search progress"</label>
            <progress
                class="progress-bar"
                role="progressbar"
                tabindex="-1"
                value="0"
                indeterminate
            >Unknown
            </progress>
          </label>
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
    
    const node = document.createElement('div')
    node.classList.add('progress-bar__container')
    
    return {
      get
    }
  }
  
  export const progressBar = ProgressBar()
  