import { StringSelectMenuOptionBuilder } from 'discord.js';
import {
  createSelectMenuWithPlaceholder,
  extractCurrentSelection,
  getMediaTitleFromEmbed,
  updateSelectMenuPlaceholder,
} from '../../src/helpers/selectMenuBuilder';

describe('select Menu Builder Helpers', () => {
  describe('createSelectMenuWithPlaceholder', () => {
    it('should use default placeholder when no selection is made', () => {
      const options = [
        new StringSelectMenuOptionBuilder()
          .setLabel('Option 1')
          .setValue('1')
          .setDescription('First option'),
      ];

      const selectMenu = createSelectMenuWithPlaceholder(
        'test-menu',
        options,
        'Choose an option',
      );

      expect(selectMenu.data.placeholder).toBe('Choose an option');
      expect(selectMenu.data.custom_id).toBe('test-menu');
    });

    it('should use selection placeholder when current selection exists', () => {
      const options = [
        new StringSelectMenuOptionBuilder()
          .setLabel('Season 1')
          .setValue('1')
          .setDescription('First season'),
      ];

      const selectMenu = createSelectMenuWithPlaceholder(
        'season-menu',
        options,
        'Choose a season',
        '1',
        'Season 1',
      );

      expect(selectMenu.data.placeholder).toBe('✓ Season 1');
      expect(selectMenu.data.custom_id).toBe('season-menu');
    });
  });

  describe('extractCurrentSelection', () => {
    it('should extract selection from embed fields', () => {
      const embed = {
        fields: [
          { name: 'Media ID', value: '12345', inline: true },
          { name: 'Season', value: 'Season 2', inline: true },
          { name: 'Episode', value: 'Episode 5', inline: true },
        ],
      };

      const seasonSelection = extractCurrentSelection(embed, 'Season');
      expect(seasonSelection).toEqual({
        value: 'Season 2',
        label: 'Season 2',
      });

      const episodeSelection = extractCurrentSelection(embed, 'Episode');
      expect(episodeSelection).toEqual({
        value: 'Episode 5',
        label: 'Episode 5',
      });
    });

    it('should return null for non-existent fields', () => {
      const embed = {
        fields: [
          { name: 'Media ID', value: '12345', inline: true },
        ],
      };

      const result = extractCurrentSelection(embed, 'Season');
      expect(result).toBeNull();
    });

    it('should handle empty fields array', () => {
      const embed = { fields: [] };
      const result = extractCurrentSelection(embed, 'Season');
      expect(result).toBeNull();
    });
  });

  describe('updateSelectMenuPlaceholder', () => {
    it('should update placeholder of target select menu', () => {
      const components = [
        {
          type: 1,
          components: [
            {
              type: 3,
              data: {
                custom_id: 'media-select',
                placeholder: 'Choose media',
              },
            },
          ],
        },
        {
          type: 1,
          components: [
            {
              type: 3,
              data: {
                custom_id: 'season-select',
                placeholder: 'Choose season',
              },
            },
          ],
        },
      ];

      const updated = updateSelectMenuPlaceholder(components, 'media-select', '✓ Breaking Bad');

      expect(updated[0].components[0].data.placeholder).toBe('✓ Breaking Bad');
      expect(updated[1].components[0].data.placeholder).toBe('Choose season'); // Unchanged
    });

    it('should handle missing target custom_id gracefully', () => {
      const components = [
        {
          type: 1,
          components: [
            {
              type: 3,
              data: {
                custom_id: 'media-select',
                placeholder: 'Choose media',
              },
            },
          ],
        },
      ];

      const updated = updateSelectMenuPlaceholder(components, 'non-existent', '✓ Test');

      expect(updated[0].components[0].data.placeholder).toBe('Choose media'); // Unchanged
    });

    it('should handle empty components array', () => {
      const components: any[] = [];
      const updated = updateSelectMenuPlaceholder(components, 'test', '✓ Test');
      expect(updated).toEqual([]);
    });
  });

  describe('getMediaTitleFromEmbed', () => {
    it('should return embed title when available', () => {
      const embed = {
        title: 'Breaking Bad (2008)',
        fields: [],
      };

      const title = getMediaTitleFromEmbed(embed);
      expect(title).toBe('Breaking Bad (2008)');
    });

    it('should truncate long titles', () => {
      const embed = {
        title: 'This is a very long television show title that should be truncated',
        fields: [],
      };

      const title = getMediaTitleFromEmbed(embed);
      expect(title).toBe('This is a very long televis...');
      expect(title.length).toBe(30);
    });

    it('should return default when no title', () => {
      const embed = { fields: [] };
      const title = getMediaTitleFromEmbed(embed);
      expect(title).toBe('Selected Media');
    });

    it('should handle empty title', () => {
      const embed = { title: '', fields: [] };
      const title = getMediaTitleFromEmbed(embed);
      expect(title).toBe('Selected Media');
    });
  });
});
