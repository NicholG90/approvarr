import type { Client, Message, TextChannel } from 'discord.js';

/**
 * Find a Discord message by request ID in the specified channel
 * @param client Discord client
 * @param requestId The request ID to search for
 * @param channelId The channel ID to search in
 * @returns The message object if found, otherwise null
 */
export async function findMessageByRequestId(
  client: Client,
  requestId: string,
  channelId: string,
): Promise<Message | null> {
  try {
    const channel = client.channels.cache.get(channelId) as TextChannel;
    if (!channel) {
      console.error(`Channel with ID ${channelId} not found.`);
      return null;
    }

    const messages = await channel.messages.fetch({ limit: 100 });

    for (const [, message] of messages) {
      if (!message.embeds || message.embeds.length === 0)
        continue;

      const embed = message.embeds[0];
      const fields = embed.fields || [];

      const requestIdField = fields.find(field => field.name === 'Request ID');
      if (requestIdField && requestIdField.value === requestId) {
        return message;
      }
    }

    console.info(`No message found for request ID: ${requestId}`);
    return null;
  }
  catch (error) {
    console.error('Error finding message by request ID:', error);
    return null;
  }
}
