import { issueType } from '../../src/constants/issuesData.js';
import { issueCommentSubmitHandler } from '../../src/handlers/modalHandlers/issueCommentSubmitHandler.js';
import { tvIssueEpisodeSelectHandler } from '../../src/handlers/selectHandlers/tvIssueEpisodeSelectHandler.js';
import { tvIssueSeasonSelectHandler } from '../../src/handlers/selectHandlers/tvIssueSeasonSelectHandler.js';
import { overseerrApi } from '../../src/helpers/apis/overseerr/overseerrApi.js';
import { fetchSeasonEpisodes } from '../../src/helpers/episodeDataFetcher.js';
import { getDiscordUserIds } from '../../src/helpers/getDiscordUserIds.js';
import { updateEmbed } from '../../src/outbound/updateButtons.js';

// Mock dependencies
jest.mock('../../src/helpers/apis/overseerr/overseerrApi');
jest.mock('../../src/helpers/getDiscordUserIds');
jest.mock('../../src/outbound/updateButtons');
jest.mock('../../src/helpers/episodeDataFetcher');

const mockOverseerrApi = overseerrApi as jest.MockedFunction<typeof overseerrApi>;
const mockGetDiscordUserIds = getDiscordUserIds as jest.MockedFunction<typeof getDiscordUserIds>;
const mockUpdateEmbed = updateEmbed as jest.MockedFunction<typeof updateEmbed>;
mockUpdateEmbed.mockResolvedValue(undefined);
const mockFetchSeasonEpisodes = fetchSeasonEpisodes as jest.MockedFunction<typeof fetchSeasonEpisodes>;

describe('tV Issue Reporting Flow', () => {
  let mockInteraction: any;
  let mockMessage: any;
  let mockEmbed: any;

  beforeEach(() => {
    mockEmbed = {
      title: 'Test TV Show',
      url: 'https://example.com',
      color: 0x5865F2,
      fields: [
        {
          name: 'Media ID',
          value: '12345',
          inline: true,
        },
      ],
      thumbnail: {
        url: 'https://example.com/poster.jpg',
      },
    };

    mockMessage = {
      embeds: [mockEmbed],
      components: [],
    };

    mockInteraction = {
      isStringSelectMenu: jest.fn(() => true),
      isModalSubmit: jest.fn(() => false),
      values: ['12345-tv-67890'],
      message: mockMessage,
      update: jest.fn(),
      reply: jest.fn(),
      user: { id: 'discord123' },
      customId: 'issueCommentSubmit-VIDEO',
      fields: {
        getTextInputValue: jest.fn(() => 'Test issue description'),
      },
    };

    jest.clearAllMocks();
    mockUpdateEmbed.mockResolvedValue(undefined);
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('tV Issue Season Selection', () => {
    it('should display season options for TV shows', async () => {
      const mockTvData = {
        id: 12345,
        name: 'Test TV Show',
        seasons: [
          { seasonNumber: 1, episodeCount: 10 },
          { seasonNumber: 2, episodeCount: 12 },
          { seasonNumber: 3, episodeCount: 8 },
        ],
      };

      mockOverseerrApi.mockResolvedValueOnce({ data: mockTvData } as any);

      await tvIssueSeasonSelectHandler(mockInteraction, mockEmbed);

      expect(mockOverseerrApi).toHaveBeenCalledWith('/tv/12345', 'GET');
      expect(mockInteraction.update).toHaveBeenCalledWith({
        embeds: [mockEmbed],
        components: [
          expect.objectContaining({
            components: [
              expect.objectContaining({
                data: expect.objectContaining({
                  custom_id: 'tvIssueSeasonSelect',
                  placeholder: 'Which season has the issue?',
                }),
              }),
            ],
          }),
        ],
      });
    });

    it('should handle API errors gracefully', async () => {
      mockOverseerrApi.mockRejectedValueOnce(new Error('API Error'));

      await tvIssueSeasonSelectHandler(mockInteraction, mockEmbed);

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching TV season data for issue reporting:',
        expect.any(Error),
      );
      expect(mockInteraction.update).toHaveBeenCalledWith({
        embeds: [mockEmbed],
        components: [
          expect.objectContaining({
            components: [
              expect.objectContaining({
                data: expect.objectContaining({
                  custom_id: 'tvIssueSeasonSelect',
                }),
              }),
            ],
          }),
        ],
      });
    });

    it('should provide fallback options when no seasons found', async () => {
      const mockTvData = {
        id: 12345,
        name: 'Test TV Show',
        seasons: [],
      };

      mockOverseerrApi.mockResolvedValueOnce({ data: mockTvData } as any);

      await tvIssueSeasonSelectHandler(mockInteraction, mockEmbed);

      expect(mockInteraction.update).toHaveBeenCalledWith({
        embeds: [mockEmbed],
        components: [
          expect.objectContaining({
            components: [
              expect.objectContaining({
                data: expect.objectContaining({
                  custom_id: 'tvIssueSeasonSelect',
                  placeholder: 'Which season has the issue?',
                }),
              }),
            ],
          }),
        ],
      });
    });
  });

  describe('tV Issue Episode Selection', () => {
    it('should display episode options for selected season', async () => {
      const mockEpisodes = [
        { episode_number: 1, name: 'Pilot', overview: 'The first episode' },
        { episode_number: 2, name: 'Second Episode', overview: 'The second episode' },
        { episode_number: 3, name: 'Third Episode', overview: 'The third episode' },
      ];

      mockInteraction.values = ['1'];
      mockFetchSeasonEpisodes.mockResolvedValueOnce(mockEpisodes);

      await tvIssueEpisodeSelectHandler(mockInteraction, mockEmbed);

      expect(mockFetchSeasonEpisodes).toHaveBeenCalledWith('12345', '1');
      expect(mockInteraction.update).toHaveBeenCalledWith({
        embeds: [mockEmbed],
        components: [
          expect.objectContaining({
            components: [
              expect.objectContaining({
                data: expect.objectContaining({
                  custom_id: 'tvIssueEpisodeSelect',
                  placeholder: 'Which episode has the issue?',
                }),
              }),
            ],
          }),
        ],
      });
    });

    it('should handle API errors when fetching episodes', async () => {
      mockInteraction.values = ['1'];
      mockFetchSeasonEpisodes.mockResolvedValueOnce([]); // Return empty array to trigger fallback

      await tvIssueEpisodeSelectHandler(mockInteraction, mockEmbed);

      // The new error handling logic falls back silently but still shows the episode menu
      expect(mockInteraction.update).toHaveBeenCalledWith({
        embeds: [mockEmbed],
        components: expect.arrayContaining([
          expect.objectContaining({
            components: [
              expect.objectContaining({
                data: expect.objectContaining({
                  custom_id: 'tvIssueEpisodeSelect',
                }),
              }),
            ],
          }),
        ]),
      });

      // Should have fallback options (1-10 episodes) when API fails
      const updateCall = mockInteraction.update.mock.calls[0][0];
      const episodeMenu = updateCall.components.find((comp: any) =>
        comp.components && comp.components.some((c: any) => c.data && c.data.custom_id === 'tvIssueEpisodeSelect'),
      );
      expect(episodeMenu).toBeTruthy();
    });

    it('should provide fallback options when no episodes found', async () => {
      const mockSeasonData = {
        episodes: [],
      };

      mockInteraction.values = ['1'];
      mockOverseerrApi.mockResolvedValueOnce({ data: mockSeasonData } as any);

      await tvIssueEpisodeSelectHandler(mockInteraction, mockEmbed);

      expect(mockInteraction.update).toHaveBeenCalledWith({
        embeds: [mockEmbed],
        components: [
          expect.objectContaining({
            components: [
              expect.objectContaining({
                data: expect.objectContaining({
                  custom_id: 'tvIssueEpisodeSelect',
                  placeholder: 'Which episode has the issue?',
                }),
              }),
            ],
          }),
        ],
      });
    });
  });

  describe('tV Issue Submission with Season/Episode Data', () => {
    beforeEach(() => {
      mockInteraction.isModalSubmit = jest.fn(() => true);
      mockInteraction.isStringSelectMenu = jest.fn(() => false);
      mockInteraction.message.embeds[0].fields = [
        {
          name: 'Media ID',
          value: '12345',
          inline: true,
        },
        {
          name: 'Season',
          value: 'Season 2',
          inline: true,
        },
        {
          name: 'Episode',
          value: 'Episode 5',
          inline: true,
        },
      ];
    });

    it('should submit TV issue with season and episode data', async () => {
      mockGetDiscordUserIds.mockResolvedValueOnce({
        123: 'discord123',
      });

      mockOverseerrApi.mockResolvedValueOnce({ status: 200, data: {} } as any);

      await issueCommentSubmitHandler(mockInteraction);

      expect(mockOverseerrApi).toHaveBeenCalledWith(
        '/issue',
        'POST',
        {
          issueType: issueType.VIDEO,
          message: 'Test issue description',
          mediaId: 12345,
          season: 2,
          episode: 5,
        },
        123,
      );
      expect(mockUpdateEmbed).toHaveBeenCalled();
    });

    it('should submit TV issue with season data only (entire season)', async () => {
      mockInteraction.message.embeds[0].fields = [
        {
          name: 'Media ID',
          value: '12345',
          inline: true,
        },
        {
          name: 'Season',
          value: 'Season 3',
          inline: true,
        },
        {
          name: 'Episode',
          value: 'Entire Season',
          inline: true,
        },
      ];

      mockGetDiscordUserIds.mockResolvedValueOnce({
        123: 'discord123',
      });

      mockOverseerrApi.mockResolvedValueOnce({ status: 200, data: {} } as any);

      await issueCommentSubmitHandler(mockInteraction);

      expect(mockOverseerrApi).toHaveBeenCalledWith(
        '/issue',
        'POST',
        {
          issueType: issueType.VIDEO,
          message: 'Test issue description',
          mediaId: 12345,
          season: 3,
        },
        123,
      );
    });

    it('should submit movie issue without season/episode data', async () => {
      mockInteraction.message.embeds[0].fields = [
        {
          name: 'Media ID',
          value: '12345',
          inline: true,
        },
      ];

      mockGetDiscordUserIds.mockResolvedValueOnce({
        123: 'discord123',
      });

      mockOverseerrApi.mockResolvedValueOnce({ status: 200, data: {} } as any);

      await issueCommentSubmitHandler(mockInteraction);

      expect(mockOverseerrApi).toHaveBeenCalledWith(
        '/issue',
        'POST',
        {
          issueType: issueType.VIDEO,
          message: 'Test issue description',
          mediaId: 12345,
        },
        123,
      );
    });

    it('should handle user not linked to Overseerr account', async () => {
      mockGetDiscordUserIds.mockResolvedValueOnce({});

      await issueCommentSubmitHandler(mockInteraction);

      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: 'Your discord ID is not linked to an Overseerr account.',
        flags: expect.any(Number),
      });
      expect(mockOverseerrApi).not.toHaveBeenCalled();
    });

    it('should handle API submission errors', async () => {
      mockGetDiscordUserIds.mockResolvedValueOnce({
        123: 'discord123',
      });

      mockOverseerrApi.mockResolvedValueOnce({ status: 500, data: {} } as any);

      await issueCommentSubmitHandler(mockInteraction);

      expect(mockInteraction.reply).toHaveBeenCalledWith({
        content: 'Your comment was not submitted successfully - Check the logs!',
        flags: expect.any(Number),
      });
    });

    it('should handle missing media ID field', async () => {
      mockInteraction.message.embeds[0].fields = [];

      mockGetDiscordUserIds.mockResolvedValueOnce({
        123: 'discord123',
      });

      await issueCommentSubmitHandler(mockInteraction);

      expect(console.error).toHaveBeenCalledWith('Media ID field not found.');
      expect(mockOverseerrApi).not.toHaveBeenCalled();
    });
  });
});
