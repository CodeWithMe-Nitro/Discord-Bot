const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup_channel')
        .setDescription('Sets up verification message in the current channel')
        .setDMPermission(false),

    async execute(interaction) {
        // Check if user has manage channels permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({
                content: 'You need the Manage Channels permission to use this command!',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('Channel Access Restricted')
            .setDescription('**Oh no... You cannot access this channel!**\n\n`To access this channel you must be verified.`\n\nHead over to <#1340416652050825286>')
            .setColor('#FF0000')
            .setTimestamp();

        try {
            // First send the verification message with embed
            await interaction.channel.send({ embeds: [embed] });

            // Then confirm to the command user
            await interaction.reply({
                content: 'Verification message has been set up in this channel!',
                ephemeral: true
            });
        } catch (error) {
            console.error('Error setting up channel:', error);
            await interaction.reply({
                content: 'There was an error setting up the message. Please check my permissions and try again.',
                ephemeral: true
            });
        }
    }
};