const Header = () => {

    const registerEventListeners = () => {

    }

    const render = page => {
        const html = `
            
                <div>
                    <img class="header-logo-img" src="/assets/logo.png" data-type="refresh" alt="Reel Talk logo">
                    <h1 class="header-logo" data-type="refresh">Reel Talk</h1>
                </div>
                <ul class="header-menu" id="menu">
                    <!--<li>
                        <a href="#">Find Movies</a>
                    </li>
                    <li>
                        <a href="#">My Lists</a>
                    </li>-->
                    <li>
                        <a href="#">Sign up</a>
                    </li>
                    <li>
                        <a href="#" class="sign-in">Sign in</a>
                    </li>
                </ul>
                <button class="hamburger hamburger--3dy" id="hamburger" type="button" data-type="hamburger">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                </button>
            
        `
        return html
    }

    const refresh = page => {
        node.innerHTML = render(page)
    }

    const get = page => {
        refresh(page)
        return node
    }

    const node = document.createElement('header')
    node.classList.add('header')

    return {
        get
    }
}

export const header = Header()