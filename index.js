const express = require("express");
const app = express();
const port = 3000;

app.all("/", (req, res) => {
    res.send("<h1 style='font-family: Segoe UI;'>Bot is online!</h1>");
});

app.listen(port, () => {
    console.log(`Express server is listening to ${port}`);
});

const { Client, Events, GatewayIntentBits, REST, Routes, EmbedBuilder } = require("discord.js");
require("dotenv").config();
const token = process.env["token"];
const clientId = process.env["clientId"];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

const { data: ventData, execute: ventExecute } = require("./commands/vent.js");

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === ventData.name) {
            ventExecute(interaction);
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "ventModal") {
            await interaction.reply({
                content: "Your vent message has successfully been sent.",
                ephemeral: true
            });

            const ventMessage = interaction.fields.getTextInputValue("ventMessage");
            const embed = new EmbedBuilder()
                .setColor("DarkButNotBlack")
                .setTitle("Anonymous")
                .setDescription(ventMessage);

            interaction.channel.send({
                embeds: [embed]
            });
        }
    }
});

const commands = [
    ventData
];

const rest = new REST().setToken(token);

async function main() {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(clientId),
            {
                body: commands
            }
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);

        client.login(token);
    } catch (err) {
        return console.log(err.message);
    }
}

main();