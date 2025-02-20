const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fake_rewards')
        .setDescription('Display invite rewards information'),

    async execute(interaction) {
        await interaction.reply({ content: 'Setting Up...', ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle('Invite Rewards')
            .setDescription('🥳 All rewards are claimed by messaging an Owner\n\n' +
                '• 5+ Invites: Premium Cheat Client (Undetectable)\n' +
                '• 10+ Invites: Discord Nitro Basic (1 month)\n' +
                '• 15+ Invites: Discord Nitro Boost (1 month)\n' +
                '• 20+ Invites: Access to all private clients, packs & gameplay mods\n' +
                '• 25+ Invites: Custom Role with Private Chats\n' +
                '• 30+ Invites: $15 PayPal\n' +
                '• 50+ Invites: Minecraft Java Account\n')
            .setColor('#FFFF00')
            .setTimestamp();

        await interaction.channel.send({ embeds: [embed] });
    }
};
