import { MessageFlags } from 'discord.js';
import { execute } from '../../src/commands/overseerr/quotaStatus.js';
import { checkUserPermission } from '../../src/helpers/permissionCheck.js';
import { checkUserQuota, formatQuotaMessage } from '../../src/helpers/quotaCheck.js';

// Mock dependencies
jest.mock('../../src/helpers/permissionCheck');
jest.mock('../../src/helpers/quotaCheck');

const mockCheckUserPermission = checkUserPermission as jest.MockedFunction<typeof checkUserPermission>;
const mockCheckUserQuota = checkUserQuota as jest.MockedFunction<typeof checkUserQuota>;
const mockFormatQuotaMessage = formatQuotaMessage as jest.MockedFunction<typeof formatQuotaMessage>;

describe('quota Status Command', () => {
  let mockInteraction: any;

  beforeEach(() => {
    mockInteraction = {
      reply: jest.fn(),
    };

    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should show quota status when user has permissions', async () => {
    mockCheckUserPermission.mockResolvedValueOnce({
      hasPermission: true,
      overseerrId: '123',
    });

    const movieQuota = {
      hasQuota: true,
      remaining: 5,
      limit: 10,
      used: 5,
      mediaType: 'movie' as const,
      restricted: false,
    };

    const tvQuota = {
      hasQuota: true,
      remaining: 2,
      limit: 5,
      used: 3,
      mediaType: 'tv' as const,
      restricted: false,
    };

    mockCheckUserQuota
      .mockResolvedValueOnce(movieQuota)
      .mockResolvedValueOnce(tvQuota);

    mockFormatQuotaMessage
      .mockReturnValueOnce('📊 **Quota Status:** 5/10 movie requests used (5 remaining).')
      .mockReturnValueOnce('📊 **Quota Status:** 3/5 tv requests used (2 remaining).');

    await execute(mockInteraction);

    expect(mockCheckUserQuota).toHaveBeenCalledWith(123, 'movie');
    expect(mockCheckUserQuota).toHaveBeenCalledWith(123, 'tv');

    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: expect.stringContaining('**Your Request Quota Status:**'),
      flags: MessageFlags.Ephemeral,
    });

    const replyContent = mockInteraction.reply.mock.calls[0][0].content;
    expect(replyContent).toContain('🎬 **Movies:**');
    expect(replyContent).toContain('📺 **TV Shows:**');
    expect(replyContent).toContain('📊 **Quota Status:** 5/10 movie requests used');
    expect(replyContent).toContain('📊 **Quota Status:** 3/5 tv requests used');
  });

  it('should show quota exceeded status', async () => {
    mockCheckUserPermission.mockResolvedValueOnce({
      hasPermission: true,
      overseerrId: '123',
    });

    const movieQuota = {
      hasQuota: false,
      remaining: 0,
      limit: 10,
      used: 10,
      mediaType: 'movie' as const,
      restricted: true,
    };

    const tvQuota = {
      hasQuota: true,
      remaining: 2,
      limit: 5,
      used: 3,
      mediaType: 'tv' as const,
      restricted: false,
    };

    mockCheckUserQuota
      .mockResolvedValueOnce(movieQuota)
      .mockResolvedValueOnce(tvQuota);

    mockFormatQuotaMessage
      .mockReturnValueOnce('❌ **Quota exceeded!** You\'ve used 10/10 movie requests.')
      .mockReturnValueOnce('📊 **Quota Status:** 3/5 tv requests used (2 remaining).');

    await execute(mockInteraction);

    const replyContent = mockInteraction.reply.mock.calls[0][0].content;
    expect(replyContent).toContain('❌ **Quota exceeded!** You\'ve used 10/10 movie requests.');
  });

  it('should show unlimited quota status', async () => {
    mockCheckUserPermission.mockResolvedValueOnce({
      hasPermission: true,
      overseerrId: '123',
    });

    const movieQuota = {
      hasQuota: true,
      remaining: Infinity,
      limit: Infinity,
      used: 0,
      mediaType: 'movie' as const,
      restricted: false,
    };

    const tvQuota = {
      hasQuota: true,
      remaining: Infinity,
      limit: Infinity,
      used: 0,
      mediaType: 'tv' as const,
      restricted: false,
    };

    mockCheckUserQuota
      .mockResolvedValueOnce(movieQuota)
      .mockResolvedValueOnce(tvQuota);

    mockFormatQuotaMessage
      .mockReturnValueOnce('No movie quota restrictions.')
      .mockReturnValueOnce('No tv quota restrictions.');

    await execute(mockInteraction);

    const replyContent = mockInteraction.reply.mock.calls[0][0].content;
    expect(replyContent).toContain('No movie quota restrictions.');
    expect(replyContent).toContain('No tv quota restrictions.');
  });

  it('should exit early when user lacks permissions', async () => {
    mockCheckUserPermission.mockResolvedValueOnce({
      hasPermission: false,
      overseerrId: undefined,
    });

    await execute(mockInteraction);

    expect(mockCheckUserQuota).not.toHaveBeenCalled();
    expect(mockInteraction.reply).not.toHaveBeenCalled();
  });

  it('should exit early when overseerrId is missing', async () => {
    mockCheckUserPermission.mockResolvedValueOnce({
      hasPermission: true,
      overseerrId: undefined,
    });

    await execute(mockInteraction);

    expect(mockCheckUserQuota).not.toHaveBeenCalled();
    expect(mockInteraction.reply).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockCheckUserPermission.mockResolvedValueOnce({
      hasPermission: true,
      overseerrId: '123',
    });

    mockCheckUserQuota.mockRejectedValueOnce(new Error('API Error'));

    await execute(mockInteraction);

    expect(console.error).toHaveBeenCalledWith(
      'Error fetching quota status:',
      expect.any(Error),
    );

    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: 'An error occurred while fetching your quota status.',
      flags: MessageFlags.Ephemeral,
    });
  });
});
