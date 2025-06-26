// Import the necessary modules
import type { Client, TextChannel } from 'discord.js';
import type { IssueNotification } from '../../interfaces/notifications';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { EmbedColors, Notification } from '../../constants/notificationData';

export function issueSender(client: Client, payload: IssueNotification): void {
  // Set the channel ID from the environment variables
  const channelId = process.env.ISSUE_CHANNEL_ID || process.env.CHANNEL_ID;

  // Check if the channel ID is defined
  if (!channelId) {
    console.error('Channel ID is undefined in the environment variables.');
    return;
  }

  // Define the color based on notification type
  let color = EmbedColors.DARK_PURPLE;
  switch (payload.notification_type) {
    case Notification.ISSUE_CREATED:
    case Notification.ISSUE_REOPENED:
      color = EmbedColors.RED;
      break;
    case Notification.ISSUE_COMMENT:
      color = EmbedColors.ORANGE;
      break;
    case Notification.ISSUE_RESOLVED:
      color = EmbedColors.GREEN;
      break;
  }

  // Create an embed using the payload data
  const embed = {
    title: payload.subject,
    url: `${process.env.OVERSEERR_URL}/issues/${payload.issue.issue_id}`,
    description: payload.event,
    color,
    fields: [
      {
        name: 'Issue Description',
        value: payload.message,
      },
      {
        name: 'Issue ID',
        value: payload.issue.issue_id,
        inline: true,
      },
      {
        name: 'Reported By',
        value: payload.issue.reportedBy_username,
        inline: true,
      },
      {
        name: 'Issue Type',
        value: payload.issue.issue_type.charAt(0).toUpperCase()
          + payload.issue.issue_type.slice(1).toLowerCase(),
        inline: true,
      },
      {
        name: 'Issue Status',
        value: payload.issue.issue_status.charAt(0).toUpperCase()
          + payload.issue.issue_status.slice(1).toLowerCase(),
        inline: true,
      },
    ],
    thumbnail: {
      url: payload.image,
    },
  };

  // Add season/episode information if available (for TV shows)
  if (payload.media && payload.media.media_type === 'tv') {
    if (payload.media.season) {
      embed.fields.push({
        name: 'Season',
        value: `Season ${payload.media.season}`,
        inline: true,
      });
    }
    if (payload.media.episode) {
      embed.fields.push({
        name: 'Episode',
        value: `Episode ${payload.media.episode}`,
        inline: true,
      });
    }
  }

  // Add comment information if available
  if (payload.comment) {
    embed.fields.push({
      name: 'Issue Comment',
      value: payload.comment.comment_message,
      inline: true,
    });
    embed.fields.push({
      name: 'Comment By',
      value: payload.comment.commentedBy_username,
      inline: true,
    });
  }

  // Get the channel from the client cache
  const channel = client.channels.cache.get(channelId) as TextChannel;
  if (!channel) {
    console.error(`Channel with ID ${channelId} not found.`);
    return;
  }

  // Only add action buttons for non-resolved issues
  if (payload.notification_type !== Notification.ISSUE_RESOLVED) {
    const comment = new ButtonBuilder()
      .setCustomId('comment')
      .setLabel('Add Comment')
      .setStyle(ButtonStyle.Primary);

    const closeIssue = new ButtonBuilder()
      .setCustomId('closeIssue')
      .setLabel('Close Issue')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(closeIssue, comment);

    channel.send({
      embeds: [embed],
      components: [row],
    });
  }
  else {
    channel.send({
      embeds: [embed],
    });
  }
}
