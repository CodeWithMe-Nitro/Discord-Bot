
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

// Store users who are waiting for their next message to be converted
const waitingUsers = new Set();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Your next message will be converted into an embed'),

    async execute(interaction) {
        waitingUsers.add(interaction.user.id);
        await interaction.reply('pasting...');
    },

    // Add message handler to bot.js
    handleMessage: async (message) => {
        if (waitingUsers.has(message.author.id)) {
            waitingUsers.delete(message.author.id);
            
            const embed = new EmbedBuilder()
                .setDescription(message.content)
                .setColor('#00FF00')
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}` });

            const messages = await message.channel.messages.fetch({ limit: 2 });
            const pastingMessage = messages.find(msg => msg.content === 'pasting...');
            if (pastingMessage) await pastingMessage.delete();
            await message.delete();
            await message.channel.send({ embeds: [embed] });
        }
    }
};
