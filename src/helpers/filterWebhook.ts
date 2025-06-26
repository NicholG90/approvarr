import { Client } from 'discord.js';
import { mediaSender } from '../outbound/notificationSenders/mediaSender';
import { testSender } from '../outbound/notificationSenders/testSender';
import { issueSender } from '../outbound/notificationSenders/issueSender';
import { WebhookPayload, MediaNotification, IssueNotification } from '../interfaces/notifications';
import { Notification } from '../constants/notificationData';

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

    console.warn(`Unhandled notification type: ${notification_type}`);
}
