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

const shaveEls = node => {
    const titles = node.querySelectorAll('.movie__title')
    let plots = node.querySelectorAll('.movie__plot')
    const genres = node.querySelectorAll('.movie__genre')
    // Only test plots, there will never be a plot without a title, genre, etc
    if (plots.length > 0) {
        
        // Convert nodelist to an array so we can use reduce and get the tallest element
        // We're using it so that we can keep testing it's height and keep 'shaving'
        // Until the target els have been reduced to the size we want. I'm doing it this
        // way because it was difficult to get the shave function to fire reliably at the 
        // appropriate time to do it's job...often it would fire too quickly and the page
        // would render with the desired elements too big, until resize event when it would
        // shave again. Like this, we just keep shaving until the job is done...I guess there
        // is potential for this to loop forever but it never occurred during testing :)
        const plotEls = [...plots]
        
        do {
            shave(titles, 50)
            shave(plots, 80)
            shave(genres, 20)
            plots = node.querySelectorAll('.movie__plot')
        } while (plotEls.some(el => el.offsetHeight > 80))
        
    }
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