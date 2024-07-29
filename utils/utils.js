// Validate an email address
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validate a plain text name
const validateName = (string) => {
  // const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ]([A-Za-zÀ-ÖØ-öø-ÿ '’-]*[A-Za-zÀ-ÖØ-öø-ÿ])?$/
  return regex.test(string)
}

// Validate password length
const validatePassword = (pw1, pw2) => {
  if (!pw1 || !pw2) {
    return false
  } else {
    return pw1 === pw2
  }
}

// Function to work out percentage of true values in an array of booleans (used
// to calculate percentage of a watchlist that's been watched)
function percentageOfTrue(arr) {
  const total = arr.length
  if (total === 0) return 0

  const trueCount = arr.reduce((accumulator, currentValue) => {
    return accumulator + (currentValue === true ? 1 : 0)
  }, 0)

  const percentage = Math.round((trueCount / total) * 100)
  return percentage
}

// Functi that attempts to get a firstname and familyname from a single
// string displayname
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
        familyName: prefix + surname,
      }
    } else {
      // If there's no family name, return the name as givenName
      return {
        givenName: givenName || '',
        familyName: '',
      }
    }
  } else {
    console.error('No name was specified')
    return {
      givenName: '',
      familyName: '',
    }
  }
}

// Shave the specified elements to the specified size
const shaveEls = () => {
  shave('.movie__plot', 80)
  shave('.movie__genre', 20)
  shave('.movie__title', 50)
}

function adjustPercentages(arr) {
  // Find the minimum and maximum values in the array
  const min = Math.min(...arr);
  const max = Math.max(...arr);

  // Calculate the range
  const range = max - min;

  // Adjust each value in the array to its relative value between 0 and 100 percent
  return arr.map(value => ((value - min) / range) * 100);
}

// A little timer function to delay execution on the main thread
const timer = (ms) => new Promise((res) => setTimeout(res, ms))

export {
  validateEmail,
  validateName,
  validatePassword,
  percentageOfTrue,
  splitName,
  shaveEls,
  timer,
  adjustPercentages
}
