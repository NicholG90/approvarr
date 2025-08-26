import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import { buttonListener } from './listeners/buttonListener.js';
import { commandListener } from './listeners/commandListener.js';
import { errorListener } from './listeners/errorListener.js';
import { modalListener } from './listeners/modalListener.js';
import { selectListener } from './listeners/selectListener.js';
import { commandRegister } from './outbound/commandRegister.js';
import { handleWebhook } from './webhooks/webhook.js';

dotenv.config();

async function startBot() {
  console.info(`Starting Approvarr`);
  console.info(`Version: ${process.env.npm_package_version}`);

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });

  const token = process.env.BOT_TOKEN;
  if (!token) {
    throw new Error('No bot token provided.');
  }

  const channelId = process.env.CHANNEL_ID;

  if (!channelId) {
    throw new Error('No channel ID provided.');
  }

  const serverID = process.env.SERVER_ID;

  if (!serverID) {
    throw new Error('No server ID provided.');
  }
  await client.login(token);

  handleWebhook(client);
  if (process.env.ENABLE_SLASH_COMMANDS === 'true') {
    commandRegister(client, token, serverID);
  }

  buttonListener(client);
  modalListener(client);
  commandListener(client);
  selectListener(client);
  errorListener(client);
}
startBot().catch((error) => {
  console.error('Bot encountered an error:', error);
});
