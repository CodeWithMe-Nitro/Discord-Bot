const { SlashCommandBuilder } = require('@discordjs/builders');
const { isValidEmail, isValidUsername } = require('../utils/validation');
const database = require('../utils/database');
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

class RegistrationCommand {
    constructor() {
        this.registrationStates = new Map();
    }

    data = new SlashCommandBuilder()
        .setName('register')
        .setDescription('Start the registration process')
        .setDMPermission(false);

    async handle(interaction) {
        console.log('Registration handle called for user:', interaction.user.tag);
        const userId = interaction.user.id;

        const modal = new ModalBuilder()
            .setCustomId('registration_modal')
            .setTitle('Account Registration');

        const usernameInput = new TextInputBuilder()
            .setCustomId('username')
            .setLabel('Enter Your Username')
            .setStyle(TextInputStyle.Short)
            .setMinLength(3)
            .setMaxLength(32)
            .setPlaceholder('Your preferred username')
            .setRequired(true);

        const emailInput = new TextInputBuilder()
            .setCustomId('email')
            .setLabel('Enter Your Email')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('your.email@example.com')
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(usernameInput);
        const secondActionRow = new ActionRowBuilder().addComponents(emailInput);

        modal.addComponents(firstActionRow, secondActionRow);

        try {
            await interaction.showModal(modal);
            console.log('Modal shown successfully to user:', interaction.user.tag);
        } catch (error) {
            console.error('Error showing modal:', error);
            await interaction.reply({
                content: 'There was an error starting the registration process. Please try again.',
                ephemeral: true
            });
        }
    }

    async handleModalSubmit(interaction) {
        console.log('Modal submitted by user:', interaction.user.tag);
        const userId = interaction.user.id;
        const username = interaction.fields.getTextInputValue('username');
        const email = interaction.fields.getTextInputValue('email');

        if (!isValidUsername(username)) {
            return interaction.reply({
                content: 'Invalid username. Please try again with a username between 3 and 32 characters.',
                ephemeral: true
            });
        }

        if (!isValidEmail(email)) {
            return interaction.reply({
                content: 'Invalid email format. Please try again with a valid email address.',
                ephemeral: true
            });
        }

        try {
            database.saveRegistration(userId, {
                username,
                email
            });

            await interaction.reply({
                content: 'Registration completed successfully! Thank you for registering.',
                ephemeral: true
            });
            console.log('Registration completed for user:', interaction.user.tag);
        } catch (error) {
            console.error('Error saving registration:', error);
            await interaction.reply({
                content: 'There was an error saving your registration. Please try again.',
                ephemeral: true
            });
        }
    }
}

module.exports = new RegistrationCommand();