import type { Client, TextChannel } from 'discord.js';
import { EmbedColors } from '../../constants/notificationData.js';

export function testSender(client: Client, payload: any) {
  const embed = {
    title: payload.subject,
    description: payload.message,
    color: EmbedColors.NAVY,
  };
  const channelId = process.env.CHANNEL_ID;
  if (!channelId) {
    console.error('Channel ID is undefined in the environment variables.');
    return;
  }
  const channel = client.channels.cache.get(channelId) as TextChannel;
  if (channel) {
    channel.send({
      embeds: [embed],
    });
  }
}
