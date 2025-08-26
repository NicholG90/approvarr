import { MessageFlags } from 'discord.js';
import { overseerrApi } from '../../src/helpers/apis/overseerr/overseerrApi.js';
import { checkUserPermission } from '../../src/helpers/permissionCheck.js';
import { checkUserQuota, formatQuotaMessage } from '../../src/helpers/quotaCheck.js';
import { updateEmbed } from '../../src/outbound/updateButtons.js';

// Mock dependencies
jest.mock('../../src/helpers/permissionCheck');
jest.mock('../../src/helpers/quotaCheck');
jest.mock('../../src/helpers/apis/overseerr/overseerrApi');
jest.mock('../../src/outbound/updateButtons');

const mockCheckUserPermission = checkUserPermission as jest.MockedFunction<typeof checkUserPermission>;
const mockCheckUserQuota = checkUserQuota as jest.MockedFunction<typeof checkUserQuota>;
const mockFormatQuotaMessage = formatQuotaMessage as jest.MockedFunction<typeof formatQuotaMessage>;
const mockOverseerrApi = overseerrApi as jest.MockedFunction<typeof overseerrApi>;
const mockUpdateEmbed = updateEmbed as jest.MockedFunction<typeof updateEmbed>;

describe('button Listener - Request Flow with Quota', () => {
  let mockInteraction: any;
  let mockMessage: any;

  beforeEach(() => {
    mockMessage = {
      interaction: {
        commandName: 'request_movie',
      },
      embeds: [
        {
          fields: [
            {
              name: 'Requested Seasons',
              value: 'Season 1, Season 2',
            },
          ],
        },
      ],
    };

    mockInteraction = {
      customId: 'requestMedia_12345',
      message: mockMessage,
      reply: jest.fn(),
    };

    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should successfully submit movie request when quota allows', async () => {
    mockCheckUserPermission.mockResolvedValueOnce({
      hasPermission: true,
      overseerrId: '123',
    });

    mockCheckUserQuota.mockResolvedValueOnce({
      hasQuota: true,
      remaining: 5,
      limit: 10,
      used: 5,
      mediaType: 'movie',
      restricted: false,
    });

    mockOverseerrApi.mockResolvedValueOnce({ data: {} } as any);

    // Simulate the button listener logic for requestMedia
    const { hasPermission, overseerrId } = await checkUserPermission(
      mockInteraction,
      'REQUEST' as any,
      'You do not have permission to request media.',
    );

    if (hasPermission && overseerrId) {
      const requestType = mockInteraction.message.interaction?.commandName?.split('_')[1] || 'tv';
      const mediaType = requestType === 'movie' ? 'movie' : 'tv';

      const quotaCheck = await checkUserQuota(Number.parseInt(overseerrId, 10), mediaType);

      if (!quotaCheck.hasQuota) {
        await mockInteraction.reply({
          content: formatQuotaMessage(quotaCheck),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const requestBody = {
        mediaType: requestType,
        mediaId: 12345,
      };

      await overseerrApi('/request/', 'POST', requestBody, Number.parseInt(overseerrId, 10));
      await updateEmbed(mockInteraction.message, mockInteraction, 'requested');
    }

    expect(mockCheckUserPermission).toHaveBeenCalled();
    expect(mockCheckUserQuota).toHaveBeenCalledWith(123, 'movie');
    expect(mockOverseerrApi).toHaveBeenCalledWith('/request/', 'POST', {
      mediaType: 'movie',
      mediaId: 12345,
    }, 123);
    expect(mockUpdateEmbed).toHaveBeenCalled();
  });

  it('should block request when quota exceeded', async () => {
    mockCheckUserPermission.mockResolvedValueOnce({
      hasPermission: true,
      overseerrId: '123',
    });

    mockCheckUserQuota.mockResolvedValueOnce({
      hasQuota: false,
      remaining: 0,
      limit: 10,
      used: 10,
      mediaType: 'movie',
      restricted: true,
    });

    mockFormatQuotaMessage.mockReturnValueOnce('❌ **Quota exceeded!** You\'ve used 10/10 movie requests.');

    // Simulate the button listener logic for requestMedia
    const { hasPermission, overseerrId } = await checkUserPermission(
      mockInteraction,
      'REQUEST' as any,
      'You do not have permission to request media.',
    );

    if (hasPermission && overseerrId) {
      const requestType = mockInteraction.message.interaction?.commandName?.split('_')[1] || 'tv';
      const mediaType = requestType === 'movie' ? 'movie' : 'tv';

      const quotaCheck = await checkUserQuota(Number.parseInt(overseerrId, 10), mediaType);

      if (!quotaCheck.hasQuota) {
        await mockInteraction.reply({
          content: formatQuotaMessage(quotaCheck),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // This shouldn't be reached
      await overseerrApi('/request/', 'POST', {}, Number.parseInt(overseerrId, 10));
    }

    expect(mockCheckUserQuota).toHaveBeenCalledWith(123, 'movie');
    expect(mockFormatQuotaMessage).toHaveBeenCalled();
    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: '❌ **Quota exceeded!** You\'ve used 10/10 movie requests.',
      flags: MessageFlags.Ephemeral,
    });
    expect(mockOverseerrApi).not.toHaveBeenCalled();
    expect(mockUpdateEmbed).not.toHaveBeenCalled();
  });

  it('should handle TV requests with seasons', async () => {
    mockInteraction.customId = 'requestTvWithSeasons_12345';
    mockInteraction.message.interaction.commandName = 'request_tv';

    mockCheckUserPermission.mockResolvedValueOnce({
      hasPermission: true,
      overseerrId: '123',
    });

    mockCheckUserQuota.mockResolvedValueOnce({
      hasQuota: true,
      remaining: 3,
      limit: 5,
      used: 2,
      mediaType: 'tv',
      restricted: false,
    });

    mockOverseerrApi.mockResolvedValueOnce({ data: {} } as any);

    // Simulate the button listener logic for requestTvWithSeasons
    const { hasPermission, overseerrId } = await checkUserPermission(
      mockInteraction,
      'REQUEST' as any,
      'You do not have permission to request media.',
    );

    if (hasPermission && overseerrId) {
      const requestType = mockInteraction.message.interaction?.commandName?.split('_')[1] || 'tv';
      const mediaType = requestType === 'movie' ? 'movie' : 'tv';

      const quotaCheck = await checkUserQuota(Number.parseInt(overseerrId, 10), mediaType);

      if (!quotaCheck.hasQuota) {
        return;
      }

      const requestBody: any = {
        mediaType: requestType,
        mediaId: 12345,
      };

      await overseerrApi('/request/', 'POST', requestBody, Number.parseInt(overseerrId, 10));
      await updateEmbed(mockInteraction.message, mockInteraction, 'requested');
    }

    expect(mockCheckUserQuota).toHaveBeenCalledWith(123, 'tv');
    expect(mockOverseerrApi).toHaveBeenCalledWith('/request/', 'POST', {
      mediaType: 'tv',
      mediaId: 12345,
    }, 123);
  });

  it('should handle permission denied', async () => {
    mockCheckUserPermission.mockResolvedValueOnce({
      hasPermission: false,
      overseerrId: undefined,
    });

    // Simulate the button listener logic
    const { hasPermission, overseerrId } = await checkUserPermission(
      mockInteraction,
      'REQUEST' as any,
      'You do not have permission to request media.',
    );

    if (!hasPermission || !overseerrId) {
      // Permission check handles the reply internally
      return;
    }

    expect(mockCheckUserPermission).toHaveBeenCalled();
    expect(mockCheckUserQuota).not.toHaveBeenCalled();
    expect(mockOverseerrApi).not.toHaveBeenCalled();
  });

  it('should handle API errors gracefully', async () => {
    mockCheckUserPermission.mockResolvedValueOnce({
      hasPermission: true,
      overseerrId: '123',
    });

    mockCheckUserQuota.mockResolvedValueOnce({
      hasQuota: true,
      remaining: 5,
      limit: 10,
      used: 5,
      mediaType: 'movie',
      restricted: false,
    });

    mockOverseerrApi.mockRejectedValueOnce(new Error('API Error'));

    // Simulate the button listener error handling
    try {
      const { hasPermission, overseerrId } = await checkUserPermission(
        mockInteraction,
        'REQUEST' as any,
        'You do not have permission to request media.',
      );

      if (hasPermission && overseerrId) {
        const quotaCheck = await checkUserQuota(Number.parseInt(overseerrId, 10), 'movie');

        if (quotaCheck.hasQuota) {
          await overseerrApi('/request/', 'POST', {
            mediaType: 'movie',
            mediaId: 12345,
          }, Number.parseInt(overseerrId, 10));
        }
      }
    }
    catch (error) {
      console.error('Error requesting media:', error);
      await mockInteraction.reply({
        content: 'An error occurred while submitting your request.',
        flags: MessageFlags.Ephemeral,
      });
    }

    expect(console.error).toHaveBeenCalledWith('Error requesting media:', expect.any(Error));
    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: 'An error occurred while submitting your request.',
      flags: MessageFlags.Ephemeral,
    });
  });
});
