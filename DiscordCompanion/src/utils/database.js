const JSONdb = require('simple-json-db');
const config = require('../config');

class Database {
    constructor() {
        this.db = new JSONdb(config.DB_PATH);
    }

    /**
     * Save user registration data
     */
    saveRegistration(userId, data) {
        this.db.set(userId, {
            ...data,
            registeredAt: new Date().toISOString()
        });
    }

    /**
     * Check if user is already registered
     */
    isUserRegistered(userId) {
        return this.db.has(userId);
    }

    /**
     * Get user registration data
     */
    getUserData(userId) {
        return this.db.get(userId);
    }
}

module.exports = new Database();
