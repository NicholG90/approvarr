import { StringSelectMenuOptionBuilder } from 'discord.js';
import {
  createSelectMenuWithPlaceholder,
  extractCurrentSelection,
} from '../../src/helpers/selectMenuBuilder.js';

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
});
