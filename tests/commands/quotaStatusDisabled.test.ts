import { execute } from '../../src/commands/overseerr/quotaStatus.js';
import { checkUserPermission } from '../../src/helpers/permissionCheck.js';
import { checkUserQuota } from '../../src/helpers/quotaCheck.js';

// Mock dependencies
jest.mock('../../src/helpers/permissionCheck');
jest.mock('../../src/helpers/quotaCheck');

const mockCheckUserPermission = checkUserPermission as jest.MockedFunction<typeof checkUserPermission>;
const mockCheckUserQuota = checkUserQuota as jest.MockedFunction<typeof checkUserQuota>;

describe('quota Status Command - Disabled Environment', () => {
  let mockInteraction: any;
  const originalEnv = process.env;

  beforeEach(() => {
    mockInteraction = {
      reply: jest.fn(),
    };

    jest.clearAllMocks();

    // Set environment to disabled for these tests
    process.env = { ...originalEnv };
    process.env.ENABLE_QUOTA_CHECK = 'false';
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('should work normally when quota checking is enabled', async () => {
    // Override for this specific test
    process.env.ENABLE_QUOTA_CHECK = 'true';

    mockCheckUserPermission.mockResolvedValueOnce({
      hasPermission: true,
      overseerrId: '123',
    });

    mockCheckUserQuota
      .mockResolvedValueOnce({
        hasQuota: true,
        remaining: 5,
        limit: 10,
        used: 5,
        mediaType: 'movie',
        restricted: false,
      })
      .mockResolvedValueOnce({
        hasQuota: true,
        remaining: 2,
        limit: 5,
        used: 3,
        mediaType: 'tv',
        restricted: false,
      });

    await execute(mockInteraction);

    expect(mockCheckUserPermission).toHaveBeenCalled();
    expect(mockCheckUserQuota).toHaveBeenCalledTimes(2);
    expect(mockInteraction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining('**Your Request Quota Status:**'),
      }),
    );
  });
});
