import { tvIssueEpisodeSelectHandler } from '../../src/handlers/selectHandlers/tvIssueEpisodeSelectHandler.js';
import { tvIssueSeasonSelectHandler } from '../../src/handlers/selectHandlers/tvIssueSeasonSelectHandler.js';
import { tvSeasonSelectHandler } from '../../src/handlers/selectHandlers/tvSeasonSelectHandler.js';
import { overseerrApi } from '../../src/helpers/apis/overseerr/overseerrApi.js';

// Mock dependencies
jest.mock('../../src/helpers/apis/overseerr/overseerrApi');

const mockOverseerrApi = overseerrApi as jest.MockedFunction<typeof overseerrApi>;

describe('stacked Select Menus', () => {
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
      components: [
        {
          type: 1,
          components: [
            {
              type: 3,
              custom_id: 'issueReportMedia',
              placeholder: 'What media would you like to report an issue with?',
            },
          ],
        },
      ],
    };

    mockInteraction = {
      isStringSelectMenu: jest.fn(() => true),
      values: ['12345-tv-67890'],
      message: mockMessage,
      update: jest.fn(),
    };

    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('issue Reporting Flow', () => {
    it('should preserve existing components when adding season select', async () => {
      const mockTvData = {
        id: 12345,
        name: 'Test TV Show',
        seasons: [
          { seasonNumber: 1, episodeCount: 10 },
          { seasonNumber: 2, episodeCount: 12 },
        ],
      };

      mockOverseerrApi.mockResolvedValueOnce({ data: mockTvData } as any);

      await tvIssueSeasonSelectHandler(mockInteraction, mockEmbed);

      expect(mockInteraction.update).toHaveBeenCalledWith({
        embeds: [mockEmbed],
        components: expect.arrayContaining([
          // Should contain original component
          expect.objectContaining({
            type: 1,
            components: expect.arrayContaining([
              expect.objectContaining({
                custom_id: 'issueReportMedia',
              }),
            ]),
          }),
          // Should contain new season select
          expect.objectContaining({
            components: expect.arrayContaining([
              expect.objectContaining({
                data: expect.objectContaining({
                  custom_id: 'tvIssueSeasonSelect',
                }),
              }),
            ]),
          }),
        ]),
      });
    });

    it('should preserve all previous components when adding episode select', async () => {
      // Set up interaction with existing season select
      mockInteraction.values = ['2'];
      mockMessage.components = [
        {
          type: 1,
          components: [
            {
              type: 3,
              custom_id: 'issueReportMedia',
              placeholder: 'What media would you like to report an issue with?',
            },
          ],
        },
        {
          type: 1,
          components: [
            {
              type: 3,
              custom_id: 'tvIssueSeasonSelect',
              placeholder: 'Which season has the issue?',
            },
          ],
        },
      ];

      const mockSeasonData = {
        episodes: [
          { episode_number: 1, name: 'Episode 1', overview: 'First episode' },
          { episode_number: 2, name: 'Episode 2', overview: 'Second episode' },
        ],
      };

      mockOverseerrApi.mockResolvedValueOnce({ data: mockSeasonData } as any);

      await tvIssueEpisodeSelectHandler(mockInteraction, mockEmbed);

      expect(mockInteraction.update).toHaveBeenCalledWith({
        embeds: [mockEmbed],
        components: expect.arrayContaining([
          // Should contain original media select
          expect.objectContaining({
            components: expect.arrayContaining([
              expect.objectContaining({
                custom_id: 'issueReportMedia',
              }),
            ]),
          }),
          // Should contain season select
          expect.objectContaining({
            components: expect.arrayContaining([
              expect.objectContaining({
                custom_id: 'tvIssueSeasonSelect',
              }),
            ]),
          }),
          // Should contain new episode select
          expect.objectContaining({
            components: expect.arrayContaining([
              expect.objectContaining({
                data: expect.objectContaining({
                  custom_id: 'tvIssueEpisodeSelect',
                }),
              }),
            ]),
          }),
        ]),
      });
    });
  });

  describe('request Flow', () => {
    it('should preserve existing components when adding season select for requests', async () => {
      const mockTvData = {
        id: 12345,
        name: 'Test TV Show',
        seasons: [
          { seasonNumber: 1, episodeCount: 10 },
          { seasonNumber: 2, episodeCount: 12 },
        ],
      };

      mockOverseerrApi.mockResolvedValueOnce({ data: mockTvData } as any);

      await tvSeasonSelectHandler(mockInteraction, mockEmbed);

      expect(mockInteraction.update).toHaveBeenCalledWith({
        embeds: [mockEmbed],
        components: expect.arrayContaining([
          // Should contain original component
          expect.objectContaining({
            type: 1,
            components: expect.arrayContaining([
              expect.objectContaining({
                custom_id: 'issueReportMedia',
              }),
            ]),
          }),
          // Should contain new season select
          expect.objectContaining({
            components: expect.arrayContaining([
              expect.objectContaining({
                data: expect.objectContaining({
                  custom_id: 'tvSeasonSelect',
                }),
              }),
            ]),
          }),
        ]),
      });
    });
  });

  describe('error Handling with Stacked Menus', () => {
    it('should preserve existing components even when API fails', async () => {
      mockOverseerrApi.mockRejectedValueOnce(new Error('API Error'));
      mockOverseerrApi.mockRejectedValueOnce(new Error('API Error')); // Both endpoints fail

      await tvIssueEpisodeSelectHandler(mockInteraction, mockEmbed);

      expect(mockInteraction.update).toHaveBeenCalledWith({
        embeds: [mockEmbed],
        components: expect.arrayContaining([
          // Should still contain original component
          expect.objectContaining({
            components: expect.arrayContaining([
              expect.objectContaining({
                custom_id: 'issueReportMedia',
              }),
            ]),
          }),
          // Should contain fallback episode select
          expect.objectContaining({
            components: expect.arrayContaining([
              expect.objectContaining({
                data: expect.objectContaining({
                  custom_id: 'tvIssueEpisodeSelect',
                }),
              }),
            ]),
          }),
        ]),
      });
    });
  });
});
