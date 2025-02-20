/**
 * Email validation utility
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Username validation utility
 */
function isValidUsername(username) {
    return username && username.length >= 3 && username.length <= 32;
}

module.exports = {
    isValidEmail,
    isValidUsername
};
