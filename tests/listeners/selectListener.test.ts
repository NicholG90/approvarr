import { issueReportSubmitHandler } from '../../src/handlers/selectHandlers/issueReportSubmitHandler.js';
import { tvIssueEpisodeSelectHandler } from '../../src/handlers/selectHandlers/tvIssueEpisodeSelectHandler.js';
import { tvIssueTypeSubmitHandler } from '../../src/handlers/selectHandlers/tvIssueTypeSubmitHandler.js';
import { mediaEmbedBuilder } from '../../src/helpers/mediaEmbedBuilder.js';
import { selectListener } from '../../src/listeners/selectListener.js';

// Mock dependencies
jest.mock('../../src/handlers/selectHandlers/issueReportSubmitHandler');
jest.mock('../../src/handlers/selectHandlers/tvIssueEpisodeSelectHandler');
jest.mock('../../src/handlers/selectHandlers/tvIssueTypeSubmitHandler');
jest.mock('../../src/helpers/mediaEmbedBuilder');

const mockIssueReportSubmitHandler = issueReportSubmitHandler as jest.MockedFunction<typeof issueReportSubmitHandler>;
const mockTvIssueEpisodeSelectHandler = tvIssueEpisodeSelectHandler as jest.MockedFunction<typeof tvIssueEpisodeSelectHandler>;
const mockTvIssueTypeSubmitHandler = tvIssueTypeSubmitHandler as jest.MockedFunction<typeof tvIssueTypeSubmitHandler>;
const mockMediaEmbedBuilder = mediaEmbedBuilder as jest.MockedFunction<typeof mediaEmbedBuilder>;

describe('select Listener - TV Issue Reporting', () => {
  let mockClient: any;
  let mockInteraction: any;
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

    mockInteraction = {
      isStringSelectMenu: jest.fn(() => true),
      customId: 'issueReportMedia',
      values: ['12345-tv-67890'],
      message: {
        embeds: [mockEmbed],
      },
    };

    mockClient = {
      on: jest.fn(),
    };

    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle issueReportMedia select for TV shows', async () => {
    mockMediaEmbedBuilder.mockResolvedValueOnce(mockEmbed);

    // Set up the listener
    selectListener(mockClient);
    const eventHandler = mockClient.on.mock.calls.find((call: any) => call[0] === 'interactionCreate')[1];

    // Execute the handler
    await eventHandler(mockInteraction);

    expect(mockMediaEmbedBuilder).toHaveBeenCalledWith(mockInteraction);
    expect(mockIssueReportSubmitHandler).toHaveBeenCalledWith(mockInteraction, mockEmbed);
  });

  it('should handle tvIssueSeasonSelect', async () => {
    mockInteraction.customId = 'tvIssueSeasonSelect';
    mockInteraction.values = ['2'];

    selectListener(mockClient);
    const eventHandler = mockClient.on.mock.calls.find((call: any) => call[0] === 'interactionCreate')[1];

    await eventHandler(mockInteraction);

    expect(mockTvIssueEpisodeSelectHandler).toHaveBeenCalledWith(
      mockInteraction,
      expect.objectContaining({
        title: 'Test TV Show',
        fields: expect.arrayContaining([
          {
            name: 'Season',
            value: 'Season 2',
            inline: true,
          },
        ]),
      }),
    );
  });

  it('should handle tvIssueEpisodeSelect', async () => {
    mockInteraction.customId = 'tvIssueEpisodeSelect';
    mockInteraction.values = ['5'];

    selectListener(mockClient);
    const eventHandler = mockClient.on.mock.calls.find((call: any) => call[0] === 'interactionCreate')[1];

    await eventHandler(mockInteraction);

    expect(mockTvIssueTypeSubmitHandler).toHaveBeenCalledWith(
      mockInteraction,
      expect.objectContaining({
        title: 'Test TV Show',
        fields: expect.arrayContaining([
          {
            name: 'Media ID',
            value: '12345',
            inline: true,
          },
        ]),
      }),
    );
  });

  it('should handle non-select menu interactions', async () => {
    mockInteraction.isStringSelectMenu = jest.fn(() => false);

    selectListener(mockClient);
    const eventHandler = mockClient.on.mock.calls.find((call: any) => call[0] === 'interactionCreate')[1];

    await eventHandler(mockInteraction);

    expect(mockIssueReportSubmitHandler).not.toHaveBeenCalled();
    expect(mockTvIssueEpisodeSelectHandler).not.toHaveBeenCalled();
    expect(mockTvIssueTypeSubmitHandler).not.toHaveBeenCalled();
  });

  it('should handle unknown select menu interactions', async () => {
    mockInteraction.customId = 'unknownSelectMenu';

    selectListener(mockClient);
    const eventHandler = mockClient.on.mock.calls.find((call: any) => call[0] === 'interactionCreate')[1];

    await eventHandler(mockInteraction);

    expect(console.error).toHaveBeenCalledWith('No handler found for this select interaction');
  });

  it('should properly format season information in embed', async () => {
    mockInteraction.customId = 'tvIssueSeasonSelect';
    mockInteraction.values = ['10'];

    selectListener(mockClient);
    const eventHandler = mockClient.on.mock.calls.find((call: any) => call[0] === 'interactionCreate')[1];

    await eventHandler(mockInteraction);

    expect(mockTvIssueEpisodeSelectHandler).toHaveBeenCalledWith(
      mockInteraction,
      expect.objectContaining({
        fields: expect.arrayContaining([
          {
            name: 'Season',
            value: 'Season 10',
            inline: true,
          },
        ]),
      }),
    );
  });
});
