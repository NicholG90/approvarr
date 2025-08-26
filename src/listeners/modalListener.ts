import type { Client } from 'discord.js';
import { issueCommentResponseHandler } from '../handlers/modalHandlers/issueCommentResponseHandler.js';
import { issueCommentSubmitHandler } from '../handlers/modalHandlers/issueCommentSubmitHandler.js';

export function modalListener(client: Client) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit())
      return;
    let { customId } = interaction;
    if (interaction.customId.includes('-')) {
      [customId] = interaction.customId.split('-');
    }
    switch (customId) {
      case 'issueCommentResponse':
        await issueCommentResponseHandler(interaction);
        break;
      case 'issueCommentSubmit':
        await issueCommentSubmitHandler(interaction);
        break;
      default:
        console.error('No handler found for this modal interaction');
    }
  });
}
