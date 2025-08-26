import type { QuotaCheckResult } from '../../src/interfaces/overseerr.js';
import { overseerrApi } from '../../src/helpers/apis/overseerr/overseerrApi.js';
import { checkUserQuota, formatQuotaMessage } from '../../src/helpers/quotaCheck.js';

// Mock the overseerrApi
jest.mock('../../src/helpers/apis/overseerr/overseerrApi');
const mockOverseerrApi = overseerrApi as jest.MockedFunction<typeof overseerrApi>;

describe('quota Check Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('checkUserQuota', () => {
    const mockUserId = 123;

    it('should return unlimited quota when user has no quota limits', async () => {
      mockOverseerrApi.mockResolvedValueOnce({
        data: {
          days: 7,
          // No movie limit field means unlimited quota
          tv: {
            used: 0,
            restricted: false,
          },
        },
      } as any);

      const result = await checkUserQuota(mockUserId, 'movie');

      expect(result).toEqual({
        hasQuota: true,
        remaining: Infinity,
        limit: Infinity,
        used: 0,
        mediaType: 'movie',
        restricted: false,
        days: 7,
      });
    });

    it('should return unlimited quota when quota limit is 0', async () => {
      mockOverseerrApi.mockResolvedValueOnce({
        data: {
          days: 7,
          limit: 0,
          used: 0,
          remaining: Infinity,
          restricted: false,
          tv: {
            used: 0,
            restricted: false,
          },
        },
      } as any);

      const result = await checkUserQuota(mockUserId, 'movie');

      expect(result).toEqual({
        hasQuota: true,
        remaining: Infinity,
        limit: Infinity,
        used: 0,
        mediaType: 'movie',
        restricted: false,
        days: 7,
      });
    });

    it('should check movie quota correctly when within limits', async () => {
      mockOverseerrApi.mockResolvedValueOnce({
        data: {
          days: 7,
          movie: {
            limit: 10,
            used: 3,
            remaining: 7,
            restricted: false,
          },
          tv: {
            used: 2,
            restricted: false,
          },
        },
      } as any);

      const result = await checkUserQuota(mockUserId, 'movie');

      expect(result).toEqual({
        hasQuota: true,
        remaining: 7,
        limit: 10,
        used: 3,
        mediaType: 'movie',
        restricted: false,
        days: 7,
      });

      expect(mockOverseerrApi).toHaveBeenCalledWith(`/user/${mockUserId}/quota`, 'GET');
    });

    it('should check TV quota correctly when within limits', async () => {
      mockOverseerrApi.mockResolvedValueOnce({
        data: {
          used: 3,
          restricted: false,
          tv: {
            limit: 5,
            used: 2,
            remaining: 3,
            restricted: false,
          },
        },
      } as any);

      const result = await checkUserQuota(mockUserId, 'tv');

      expect(result).toEqual({
        hasQuota: true,
        remaining: 3,
        limit: 5,
        used: 2,
        mediaType: 'tv',
        restricted: false,
        days: 7,
      });

      expect(mockOverseerrApi).toHaveBeenCalledWith(`/user/${mockUserId}/quota`, 'GET');
    });

    it('should detect quota exceeded', async () => {
      mockOverseerrApi.mockResolvedValueOnce({
        data: {
          days: 7,
          movie: {
            limit: 5,
            used: 5,
            remaining: 0,
            restricted: true,
          },
          tv: {
            used: 0,
            restricted: false,
          },
        },
      } as any);

      const result = await checkUserQuota(mockUserId, 'movie');

      expect(result).toEqual({
        hasQuota: false,
        remaining: 0,
        limit: 5,
        used: 5,
        mediaType: 'movie',
        restricted: true,
        days: 7,
      });
    });

    it('should handle quota over limit gracefully', async () => {
      mockOverseerrApi.mockResolvedValueOnce({
        data: {
          days: 7,
          movie: {
            limit: 5,
            used: 8,
            remaining: 0,
            restricted: true,
          },
          tv: {
            used: 0,
            restricted: false,
          },
        },
      } as any);

      const result = await checkUserQuota(mockUserId, 'movie');

      expect(result).toEqual({
        hasQuota: false,
        remaining: 0,
        limit: 5,
        used: 8,
        mediaType: 'movie',
        restricted: true,
        days: 7,
      });
    });

    it('should handle API errors gracefully', async () => {
      mockOverseerrApi.mockRejectedValueOnce(new Error('API Error'));

      const result = await checkUserQuota(mockUserId, 'movie');

      expect(result).toEqual({
        hasQuota: true,
        remaining: Infinity,
        limit: Infinity,
        used: 0,
        mediaType: 'movie',
        restricted: false,
        days: 7,
      });

      expect(console.error).toHaveBeenCalledWith(
        `Error checking quota for user ${mockUserId}:`,
        expect.any(Error),
      );
    });

    it('should handle missing quota data', async () => {
      mockOverseerrApi.mockResolvedValueOnce({
        data: {
          // No quota fields means unlimited
          tv: null,
        },
      } as any);

      const result = await checkUserQuota(mockUserId, 'movie');

      expect(result).toEqual({
        hasQuota: true,
        remaining: Infinity,
        limit: Infinity,
        used: 0,
        mediaType: 'movie',
        restricted: false,
        days: 7,
      });
    });
  });

  describe('formatQuotaMessage', () => {
    it('should format unlimited quota message', () => {
      const quota: QuotaCheckResult = {
        hasQuota: true,
        remaining: Infinity,
        limit: Infinity,
        used: 0,
        mediaType: 'movie',
        restricted: false,
      };

      const message = formatQuotaMessage(quota);
      expect(message).toBe('No movie quota restrictions.');
    });

    it('should format zero limit quota message', () => {
      const quota: QuotaCheckResult = {
        hasQuota: true,
        remaining: Infinity,
        limit: Infinity,
        used: 0,
        mediaType: 'tv',
        restricted: false,
      };

      const message = formatQuotaMessage(quota);
      expect(message).toBe('No tv quota restrictions.');
    });

    it('should format quota exceeded message', () => {
      const quota: QuotaCheckResult = {
        hasQuota: false,
        remaining: 0,
        limit: 5,
        used: 5,
        mediaType: 'movie',
        restricted: true,
        days: 7,
      };

      const message = formatQuotaMessage(quota);
      expect(message).toBe('❌ **Quota exceeded!** You\'ve used 5/5 movie requests in the last 7 days.');
    });

    it('should format quota status message with remaining quota', () => {
      const quota: QuotaCheckResult = {
        hasQuota: true,
        remaining: 3,
        limit: 10,
        used: 7,
        mediaType: 'tv',
        restricted: false,
        days: 14,
      };

      const message = formatQuotaMessage(quota);
      expect(message).toBe('📊 **Quota Status:** 7/10 tv requests used in the last 14 days (3 remaining).');
    });

    it('should format quota status message with full quota available', () => {
      const quota: QuotaCheckResult = {
        hasQuota: true,
        remaining: 5,
        limit: 5,
        used: 0,
        mediaType: 'movie',
        restricted: false,
        days: 1,
      };

      const message = formatQuotaMessage(quota);
      expect(message).toBe('📊 **Quota Status:** 0/5 movie requests used in the last 1 day (5 remaining).');
    });
  });
});
