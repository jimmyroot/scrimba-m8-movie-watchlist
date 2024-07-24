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

const shaveEl = el => {
    const title = el.querySelector('.movie__title')
    const genre = el.querySelector('.movie__genre')
    const plot = el.querySelector('.movie__plot')

    shave(plot, 80)
    shave(genre, 20)
    shave(title, 50)
}

const shaveEls = () => {
    shave('.movie__plot', 80)
    shave('.movie__genre', 20)
    shave('.movie__title', 50)
}

const timer = ms => new Promise(res => setTimeout(res, ms))

export {
    validateEmail,
    validateName,
    validatePassword,
    percentageOfTrue,
    splitName,
    shaveEls,
    shaveEl,
    timer
}