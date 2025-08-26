import { execute as executeMovieRequest } from '../../src/commands/overseerr/requestMovie.js';
import { execute as executeTvRequest } from '../../src/commands/overseerr/requestTv.js';
import { overseerrApi } from '../../src/helpers/apis/overseerr/overseerrApi.js';
import { checkUserPermission } from '../../src/helpers/permissionCheck.js';
import { checkUserQuota } from '../../src/helpers/quotaCheck.js';
import { mediaSelectList } from '../../src/outbound/mediaSelects/mediaSelectList.js';

// Mock dependencies
jest.mock('../../src/helpers/apis/overseerr/overseerrApi');
jest.mock('../../src/outbound/mediaSelects/mediaSelectList');
jest.mock('../../src/helpers/permissionCheck');
jest.mock('../../src/helpers/quotaCheck');

const mockOverseerrApi = overseerrApi as jest.MockedFunction<typeof overseerrApi>;
const mockMediaSelectList = mediaSelectList as jest.MockedFunction<typeof mediaSelectList>;
const mockCheckUserPermission = checkUserPermission as jest.MockedFunction<typeof checkUserPermission>;
const mockCheckUserQuota = checkUserQuota as jest.MockedFunction<typeof checkUserQuota>;

describe('request Commands', () => {
  let mockInteraction: any;

  beforeEach(() => {
    mockInteraction = {
      options: {
        getString: jest.fn(),
      },
      reply: jest.fn(),
      isRepliable: jest.fn().mockReturnValue(true),
      user: { id: 'test-user-id' },
      guildId: 'test-guild-id',
    };

    // Setup default successful permission and quota checks
    mockCheckUserPermission.mockResolvedValue({
      hasPermission: true,
      overseerrId: '123',
    });

    mockCheckUserQuota.mockResolvedValue({
      hasQuota: true,
      remaining: 5,
      limit: 10,
      used: 5,
      mediaType: 'movie',
      restricted: false,
      days: 7,
    });

    jest.clearAllMocks();
  });

  describe('movie Request Command', () => {
    it('should search and display movie results', async () => {
      const mockSearchResults = {
        data: {
          results: [
            {
              id: 1,
              title: 'Test Movie',
              mediaType: 'movie',
              releaseDate: '2023-01-01',
            },
            {
              id: 2,
              title: 'Another Movie',
              mediaType: 'movie',
              releaseDate: '2023-02-01',
            },
            {
              id: 3,
              title: 'Test TV Show',
              mediaType: 'tv',
              firstAirDate: '2023-01-01',
            },
          ],
        },
      };

      mockInteraction.options.getString.mockReturnValue('test movie');
      mockOverseerrApi.mockResolvedValueOnce(mockSearchResults as any);

      await executeMovieRequest(mockInteraction);

      expect(mockInteraction.options.getString).toHaveBeenCalledWith('movie_title');
      expect(mockOverseerrApi).toHaveBeenCalledWith('/search?query=test movie', 'get');

      // Should filter to only movies
      const expectedMovieResults = [
        {
          id: 1,
          title: 'Test Movie',
          mediaType: 'movie',
          releaseDate: '2023-01-01',
        },
        {
          id: 2,
          title: 'Another Movie',
          mediaType: 'movie',
          releaseDate: '2023-02-01',
        },
      ];

      expect(mockMediaSelectList).toHaveBeenCalledWith(mockInteraction, expectedMovieResults);
    });

    it('should handle empty movie title', async () => {
      mockInteraction.options.getString.mockReturnValue(null);

      await executeMovieRequest(mockInteraction);

      expect(mockInteraction.reply).toHaveBeenCalledWith('You did not provide a Movie title');
      expect(mockOverseerrApi).not.toHaveBeenCalled();
    });

    it('should handle no search results', async () => {
      mockInteraction.options.getString.mockReturnValue('nonexistent movie');
      mockOverseerrApi.mockResolvedValueOnce({ data: { results: [] } } as any);

      await executeMovieRequest(mockInteraction);

      expect(mockInteraction.reply).toHaveBeenCalledWith('No results found');
      expect(mockMediaSelectList).not.toHaveBeenCalled();
    });
  });

  describe('tV Request Command', () => {
    it('should search and display TV results', async () => {
      const mockSearchResults = {
        data: {
          results: [
            {
              id: 1,
              name: 'Test TV Show',
              mediaType: 'tv',
              firstAirDate: '2023-01-01',
            },
            {
              id: 2,
              name: 'Another TV Show',
              mediaType: 'tv',
              firstAirDate: '2023-02-01',
            },
            {
              id: 3,
              title: 'Test Movie',
              mediaType: 'movie',
              releaseDate: '2023-01-01',
            },
          ],
        },
      };

      mockInteraction.options.getString.mockReturnValue('test tv show');
      mockOverseerrApi.mockResolvedValueOnce(mockSearchResults as any);

      await executeTvRequest(mockInteraction);

      expect(mockInteraction.options.getString).toHaveBeenCalledWith('tv_title');
      expect(mockOverseerrApi).toHaveBeenCalledWith('/search?query=test tv show', 'get');

      // Should filter to only TV shows
      const expectedTvResults = [
        {
          id: 1,
          name: 'Test TV Show',
          mediaType: 'tv',
          firstAirDate: '2023-01-01',
        },
        {
          id: 2,
          name: 'Another TV Show',
          mediaType: 'tv',
          firstAirDate: '2023-02-01',
        },
      ];

      expect(mockMediaSelectList).toHaveBeenCalledWith(mockInteraction, expectedTvResults);
    });

    it('should handle empty TV title', async () => {
      mockInteraction.options.getString.mockReturnValue(null);

      await executeTvRequest(mockInteraction);

      expect(mockInteraction.reply).toHaveBeenCalledWith('You did not provide a TV Series title');
      expect(mockOverseerrApi).not.toHaveBeenCalled();
    });

    it('should handle no search results', async () => {
      mockInteraction.options.getString.mockReturnValue('nonexistent tv show');
      mockOverseerrApi.mockResolvedValueOnce({ data: { results: [] } } as any);

      await executeTvRequest(mockInteraction);

      expect(mockInteraction.reply).toHaveBeenCalledWith('No results found');
      expect(mockMediaSelectList).not.toHaveBeenCalled();
    });
  });

  describe('search Integration', () => {
    it('should handle API errors gracefully', async () => {
      mockInteraction.options.getString.mockReturnValue('test movie');
      mockOverseerrApi.mockRejectedValueOnce(new Error('API Error'));

      await expect(executeMovieRequest(mockInteraction)).rejects.toThrow('API Error');
    });

    it('should handle malformed search results', async () => {
      mockInteraction.options.getString.mockReturnValue('test movie');
      mockOverseerrApi.mockResolvedValueOnce({ data: { results: null } } as any);

      await expect(executeMovieRequest(mockInteraction)).rejects.toThrow();
    });

    it('should properly encode search queries', async () => {
      mockInteraction.options.getString.mockReturnValue('movie with spaces & symbols');
      mockOverseerrApi.mockResolvedValueOnce({ data: { results: [] } } as any);

      await executeMovieRequest(mockInteraction);

      expect(mockOverseerrApi).toHaveBeenCalledWith('/search?query=movie with spaces & symbols', 'get');
    });
  });
});
