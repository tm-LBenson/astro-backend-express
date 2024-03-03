'use strict';
require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
function initializeDiscordBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  const CHANNEL_ID = '559253806135640082';

  async function readConfigAndMessages() {
    const data = await fs.promises.readFile('tomMessages.json', 'utf8');
    return JSON.parse(data);
  }

  async function sendRandomMessageAboutTom() {
    try {
      const { messages } = await readConfigAndMessages();
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      const channel = await client.channels.fetch(CHANNEL_ID);
      if (channel) {
        channel.send(randomMessage);
        console.log(`Sent message: ${randomMessage}`);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }

  async function startRandomMessageInterval() {
    const { intervalMinutes } = await readConfigAndMessages();
    const intervalMilliseconds = intervalMinutes * 60 * 1000;

    function scheduleNextMessage() {
      setTimeout(() => {
        sendRandomMessageAboutTom().then(scheduleNextMessage);
      }, intervalMilliseconds);
    }

    scheduleNextMessage();
  }

  client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    startRandomMessageInterval();
  });

  client.login(BOT_TOKEN);
}

module.exports = initializeDiscordBot;
