import { TextChannel, Client, Message } from 'discord.js';

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
    channelId: string
): Promise<Message | null> {
    try {
        // Get the channel
        const channel = client.channels.cache.get(channelId) as TextChannel;
        if (!channel) {
            console.error(`Channel with ID ${channelId} not found.`);
            return null;
        }

        // Fetch recent messages (Discord API limitation - only fetches 100 at a time)
        const messages = await channel.messages.fetch({ limit: 100 });

        // Find the message with the request ID in its embed
        for (const [, message] of messages) {
            if (!message.embeds || message.embeds.length === 0) continue;

            const embed = message.embeds[0];
            const fields = embed.fields || [];

            // Look for Request ID field
            const requestIdField = fields.find(field => field.name === 'Request ID');
            if (requestIdField && requestIdField.value === requestId) {
                return message;
            }
        }

        console.info(`No message found for request ID: ${requestId}`);
        return null;
    } catch (error) {
        console.error('Error finding message by request ID:', error);
        return null;
    }
}
