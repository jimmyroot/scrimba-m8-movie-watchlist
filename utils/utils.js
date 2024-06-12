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

export {
    validateEmail,
    validatePlainText,
    validatePassword
}