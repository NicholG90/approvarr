import type { Client } from 'discord.js';
import { issueCommentResponseHandler } from '../handlers/modalHandlers/issueCommentResponseHandler';
import { issueCommentSubmitHandler } from '../handlers/modalHandlers/issueCommentSubmitHandler';

export function modalListener(client: Client) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit())
      return;
    // Issue Type is passed as part of the custom ID so we need to split it
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
