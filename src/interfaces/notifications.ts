import type { Notification } from '../constants/notificationData.js';

export interface BaseNotification {
  notification_type: Notification;
  subject: string;
  message: string;
  event: string;
  image: string;
}

export interface MediaNotification extends BaseNotification {
  request: {
    request_id: string;
    requestedBy_username: string;
    media_type: string;
    media_status: number;
  };
  extra: Array<{
    name: string;
    value: string;
  }>;
}

export interface IssueNotification extends BaseNotification {
  issue: {
    issue_id: string;
    reportedBy_username: string;
    issue_type: string;
    issue_status: string;
  };
  media?: {
    media_type: string;
    season?: number;
    episode?: number;
  };
  comment?: {
    comment_message: string;
    commentedBy_username: string;
  };
}

export interface TestNotification extends BaseNotification {
}

export type WebhookPayload = MediaNotification | IssueNotification | TestNotification;
