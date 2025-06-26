import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import { buttonListener } from './listeners/buttonListener';
import { commandListener } from './listeners/commandListener';
import { errorListener } from './listeners/errorListener';
import { modalListener } from './listeners/modalListener';
import { selectListener } from './listeners/selectListener';
import { commandRegister } from './outbound/commandRegister';
import { handleWebhook } from './webhooks/webhook';

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

  // Get the Discord bot token from the environment variables
  const token = process.env.BOT_TOKEN;
  if (!token) {
    // If the bot token is not defined, throw an error
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
  // Start the Discord bot by logging in with the bot token
  await client.login(token);

  // Start the webhook server
  handleWebhook(client);
  if (process.env.ENABLE_SLASH_COMMANDS === 'true') {
    commandRegister(client, token, serverID);
  }

  // Set up event listeners
  buttonListener(client);
  modalListener(client);
  commandListener(client);
  selectListener(client);
  errorListener(client);
}
// Call the startBot function and handle any errors that occur
startBot().catch((error) => {
  console.error('Bot encountered an error:', error);
});
