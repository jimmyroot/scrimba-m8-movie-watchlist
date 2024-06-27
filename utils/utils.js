const validateEmail = email => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
}

const validatePlainText = string => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/
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

export {
    validateEmail,
    validatePlainText,
    validatePassword,
    percentageOfTrue
}