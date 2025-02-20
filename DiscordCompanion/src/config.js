module.exports = {
    // Discord bot token would be provided through environment variables
    TOKEN: process.env.DISCORD_TOKEN || 'YOUR_DISCORD_TOKEN',
    // Command prefix for the bot
    PREFIX: '!',
    // Registration timeout (in milliseconds)
    REGISTRATION_TIMEOUT: 300000, // 5 minutes
    // Database file path
    DB_PATH: './database.json'
};
