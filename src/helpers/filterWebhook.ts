import type { Client } from 'discord.js';
import type { IssueNotification, MediaNotification, WebhookPayload } from '../interfaces/notifications.js';
import { Notification } from '../constants/notificationData.js';
import { issueSender } from '../outbound/notificationSenders/issueSender.js';
import { mediaSender } from '../outbound/notificationSenders/mediaSender.js';
import { testSender } from '../outbound/notificationSenders/testSender.js';

export async function filterWebhook(client: Client, payload: WebhookPayload): Promise<void> {
  const { notification_type } = payload;

  if (notification_type === Notification.TEST_NOTIFICATION) {
    testSender(client, payload);
    return;
  }

  if (notification_type.includes('MEDIA')) {
    await mediaSender(client, payload as MediaNotification);
    return;
  }

  if (notification_type.includes('ISSUE')) {
    issueSender(client, payload as IssueNotification);
    return;
  }

  console.error(`Unhandled notification type: ${notification_type}`);
}
