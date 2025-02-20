
const crypto = require('crypto');

const verificationCodes = new Map();

function generateVerificationCode(userId) {
    const code = crypto.randomInt(100000, 999999).toString();
    verificationCodes.set(userId, code);
    return code;
}

function verifyCode(userId, code) {
    const storedCode = verificationCodes.get(userId);
    if (storedCode === code) {
        verificationCodes.delete(userId);
        return true;
    }
    return false;
}

module.exports = {
    generateVerificationCode,
    verifyCode
};
