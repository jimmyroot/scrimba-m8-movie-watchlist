const validateEmail = email => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
}

const validateName = string => {
    // const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ]([A-Za-zÀ-ÖØ-öø-ÿ '’-]*[A-Za-zÀ-ÖØ-öø-ÿ])?$/
    return regex.test(string)
}

const validatePassword = (pw1, pw2) => {
    if (!pw1 || !pw2) {
        return false
    } else {
        return pw1 === pw2
    }
}

function percentageOfTrue(arr) {
    const total = arr.length;
    if (total === 0) return 0
  
    const trueCount = arr.reduce((accumulator, currentValue) => {
      return accumulator + (currentValue === true ? 1 : 0)
    }, 0)
  
    const percentage = Math.round((trueCount / total) * 100)
    return percentage
}

function splitName(name) {
    if (name) {
        // Regular expression to match names with possible prefixes
        const regex = /^(van(?: de| der)?\s)?(.+)$/i

        const [givenName, familyName] = name.split(' ')

        // Handle cases where surname might include "van", "van de", or "van der"
        const match = familyName ? familyName.match(regex) : givenName.match(regex)
        if (match) {
        const prefix = match[1] || ''
        const surname = match[2]
        return {
            givenName: familyName ? givenName : '',
            familyName: prefix + surname
        }
        } else {
        // If there's no family name, return the name as givenName
            return {
                givenName: givenName || '',
                familyName: ''
            }
        }
    }
    else {
        console.error('No name was specified')
        return {
            givenName: '',
            familyName: ''
        }
    }
}

const shaveEls = () => {
    let titles = document.querySelectorAll('.movie__title')
    let plots = document.querySelectorAll('.movie__plot')
    let genres = document.querySelectorAll('.movie__genre')
    let plotEls = [...plots]

    let needToShave = plotEls.some(el => el.offsetHeight >= 80)

    while (needToShave) {
        shave(titles, 50)
        shave(plots, 80)
        shave(genres, 20)
        titles = document.querySelectorAll('.movie__title')
        plots = document.querySelectorAll('.movie__plot')
        genres = document.querySelectorAll('.movie__genre')

        plotEls = [...plots]
        console.log(plotEls)
        plotEls.forEach(el => console.log(el.clientHeight))
        needToShave = plotEls.some(el => el.clientHeight >= 80)

        console.log(needToShave)
    }
    // Only test plots, there will never be a plot without a title, genre, etc
    // if (plots.length > 0) {
    //     const plotEls = [...plots]
        
    //     // do {
    //     shave(titles, 50)
    //     shave(plots, 80)
    //     shave(genres, 20)
    //         // plots = node.querySelectorAll('.movie__plot')
    //     // } while (plotEls.some(el => el.offsetHeight > 80))
        
    // }
}

const timer = ms => new Promise(res => setTimeout(res, ms))

export {
    validateEmail,
    validateName,
    validatePassword,
    percentageOfTrue,
    splitName,
    shaveEls,
    timer
}