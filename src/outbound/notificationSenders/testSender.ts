// Import the necessary modules
import type { Client, TextChannel } from 'discord.js';
import { EmbedColors } from '../../constants/notificationData';

export function testSender(client: Client, payload: any) {
  // Create an embed using the payload data
  const embed = {
    title: payload.subject,
    description: payload.message,
    color: EmbedColors.NAVY,
  };
    // Set the channel ID from the environment variables
  const channelId = process.env.CHANNEL_ID;
  // Check if the channel ID is defined
  if (!channelId) {
    console.error('Channel ID is undefined in the environment variables.');
    return;
  }
  // Get the channel from the client cache
  const channel = client.channels.cache.get(channelId) as TextChannel;
  // Send the message to the channel
  if (channel) {
    channel.send({
      embeds: [embed],
    });
  }
}
