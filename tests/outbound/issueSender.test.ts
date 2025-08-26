import type { IssueNotification } from '../../src/interfaces/notifications.js';
import { Notification } from '../../src/constants/notificationData.js';
import { issueSender } from '../../src/outbound/notificationSenders/issueSender.js';

describe('issue Sender - Season/Episode Display', () => {
  let mockClient: any;
  let mockChannel: any;
  let originalEnv: any;

  beforeEach(() => {
    // Save original environment
    originalEnv = process.env.ISSUE_CHANNEL_ID;
    process.env.ISSUE_CHANNEL_ID = 'test-channel-id';

    mockChannel = {
      send: jest.fn(),
    };

    mockClient = {
      channels: {
        cache: {
          get: jest.fn(() => mockChannel),
        },
      },
    };

    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    // Restore original environment
    process.env.ISSUE_CHANNEL_ID = originalEnv;
    jest.restoreAllMocks();
  });

  it('should display season and episode information for TV issue notifications', () => {
    const payload: IssueNotification = {
      notification_type: Notification.ISSUE_CREATED,
      subject: 'New Issue: Breaking Bad',
      message: 'Audio is out of sync',
      event: 'Issue created',
      image: 'https://example.com/poster.jpg',
      issue: {
        issue_id: '123',
        reportedBy_username: 'testuser',
        issue_type: 'audio',
        issue_status: 'open',
      },
      media: {
        media_type: 'tv',
        season: 3,
        episode: 7,
      },
    };

    issueSender(mockClient, payload);

    expect(mockChannel.send).toHaveBeenCalledWith({
      embeds: [
        expect.objectContaining({
          fields: expect.arrayContaining([
            {
              name: 'Season',
              value: 'Season 3',
              inline: true,
            },
            {
              name: 'Episode',
              value: 'Episode 7',
              inline: true,
            },
          ]),
        }),
      ],
      components: expect.any(Array),
    });
  });

  it('should display only season information when episode is not specified', () => {
    const payload: IssueNotification = {
      notification_type: Notification.ISSUE_CREATED,
      subject: 'New Issue: Breaking Bad',
      message: 'Entire season has quality issues',
      event: 'Issue created',
      image: 'https://example.com/poster.jpg',
      issue: {
        issue_id: '124',
        reportedBy_username: 'testuser',
        issue_type: 'video',
        issue_status: 'open',
      },
      media: {
        media_type: 'tv',
        season: 2,
      },
    };

    issueSender(mockClient, payload);

    expect(mockChannel.send).toHaveBeenCalledWith({
      embeds: [
        expect.objectContaining({
          fields: expect.arrayContaining([
            {
              name: 'Season',
              value: 'Season 2',
              inline: true,
            },
          ]),
        }),
      ],
      components: expect.any(Array),
    });

    // Ensure episode field is not added
    const sentEmbed = mockChannel.send.mock.calls[0][0].embeds[0];
    const episodeField = sentEmbed.fields.find((field: any) => field.name === 'Episode');
    expect(episodeField).toBeUndefined();
  });

  it('should not display season/episode info for movie issues', () => {
    const payload: IssueNotification = {
      notification_type: Notification.ISSUE_CREATED,
      subject: 'New Issue: The Matrix',
      message: 'Video quality is poor',
      event: 'Issue created',
      image: 'https://example.com/poster.jpg',
      issue: {
        issue_id: '125',
        reportedBy_username: 'testuser',
        issue_type: 'video',
        issue_status: 'open',
      },
      media: {
        media_type: 'movie',
      },
    };

    issueSender(mockClient, payload);

    expect(mockChannel.send).toHaveBeenCalledWith({
      embeds: [
        expect.objectContaining({
          fields: expect.not.arrayContaining([
            expect.objectContaining({
              name: 'Season',
            }),
            expect.objectContaining({
              name: 'Episode',
            }),
          ]),
        }),
      ],
      components: expect.any(Array),
    });
  });

  it('should not display season/episode info when media info is not provided', () => {
    const payload: IssueNotification = {
      notification_type: Notification.ISSUE_CREATED,
      subject: 'New Issue: Unknown Media',
      message: 'General issue',
      event: 'Issue created',
      image: 'https://example.com/poster.jpg',
      issue: {
        issue_id: '126',
        reportedBy_username: 'testuser',
        issue_type: 'other',
        issue_status: 'open',
      },
    };

    issueSender(mockClient, payload);

    expect(mockChannel.send).toHaveBeenCalledWith({
      embeds: [
        expect.objectContaining({
          fields: expect.not.arrayContaining([
            expect.objectContaining({
              name: 'Season',
            }),
            expect.objectContaining({
              name: 'Episode',
            }),
          ]),
        }),
      ],
      components: expect.any(Array),
    });
  });

  it('should handle resolved issues without action buttons', () => {
    const payload: IssueNotification = {
      notification_type: Notification.ISSUE_RESOLVED,
      subject: 'Issue Resolved: Breaking Bad',
      message: 'Audio sync issue has been fixed',
      event: 'Issue resolved',
      image: 'https://example.com/poster.jpg',
      issue: {
        issue_id: '127',
        reportedBy_username: 'testuser',
        issue_type: 'audio',
        issue_status: 'resolved',
      },
      media: {
        media_type: 'tv',
        season: 1,
        episode: 1,
      },
    };

    issueSender(mockClient, payload);

    expect(mockChannel.send).toHaveBeenCalledWith({
      embeds: [
        expect.objectContaining({
          fields: expect.arrayContaining([
            {
              name: 'Season',
              value: 'Season 1',
              inline: true,
            },
            {
              name: 'Episode',
              value: 'Episode 1',
              inline: true,
            },
          ]),
        }),
      ],
    });

    // Should not have components for resolved issues
    expect(mockChannel.send.mock.calls[0][0].components).toBeUndefined();
  });

  it('should handle missing channel gracefully', () => {
    mockClient.channels.cache.get.mockReturnValueOnce(null);

    const payload: IssueNotification = {
      notification_type: Notification.ISSUE_CREATED,
      subject: 'New Issue: Test Show',
      message: 'Test issue',
      event: 'Issue created',
      image: 'https://example.com/poster.jpg',
      issue: {
        issue_id: '128',
        reportedBy_username: 'testuser',
        issue_type: 'other',
        issue_status: 'open',
      },
    };

    issueSender(mockClient, payload);

    expect(console.error).toHaveBeenCalledWith('Channel with ID test-channel-id not found.');
    expect(mockChannel.send).not.toHaveBeenCalled();
  });
});
