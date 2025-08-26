import type { TvSeason } from '../interfaces/overseerr.js';
import { StringSelectMenuOptionBuilder } from 'discord.js';

export class UIUtils {
  static createSeasonOptions(seasons: TvSeason[]): StringSelectMenuOptionBuilder[] {
    const validSeasons = seasons.filter(season => season.seasonNumber > 0);
    return validSeasons.map(season =>
      new StringSelectMenuOptionBuilder()
        .setLabel(`Season ${season.seasonNumber}`)
        .setValue(season.seasonNumber.toString())
        .setDescription(`${season.episodeCount || 0} episodes`),
    );
  }

  static createEpisodeOptions(episodes: any[]): StringSelectMenuOptionBuilder[] {
    return episodes.map((episode) => {
      const episodeNum = episode.episode_number || episode.episodeNumber;
      const episodeName = episode.name || `Episode ${episodeNum}`;
      const overview = episode.overview
        ? (episode.overview.length > 60 ? `${episode.overview.substring(0, 60)}...` : episode.overview)
        : 'No description available';

      return new StringSelectMenuOptionBuilder()
        .setLabel(`Episode ${episodeNum}: ${episodeName}`)
        .setValue(episodeNum.toString())
        .setDescription(overview);
    });
  }

  static createFallbackEpisodeOptions(count: number = 10): StringSelectMenuOptionBuilder[] {
    return Array.from({ length: count }, (_, i) =>
      new StringSelectMenuOptionBuilder()
        .setLabel(`Episode ${i + 1}`)
        .setValue(`${i + 1}`)
        .setDescription(`Episode ${i + 1}`));
  }

  static formatMediaLabel(media: any, mediaType?: string): string {
    const type = mediaType || media.mediaType;

    if (type === 'tv') {
      const name = media.name || 'Unknown TV Series';
      const year = media.firstAirDate?.split('-')[0] || 'Unknown';
      return `${name} (${year})`;
    }

    const title = media.title || 'Unknown Movie';
    const year = media.releaseDate?.split('-')[0] || 'Unknown';
    return `${title} (${year})`;
  }

  static extractMediaId(mediaEmbed: any): string {
    const fields = mediaEmbed.data?.fields || mediaEmbed.fields;
    const mediaIdField = fields?.find((field: any) => field.name === 'Media ID');
    if (!mediaIdField) {
      throw new Error('Media ID not found in embed');
    }
    return mediaIdField.value;
  }

  static preserveComponents(existingComponents: any[], newRow: any) {
    const components = [...(existingComponents || [])];

    const newRowHasButtons = newRow.components?.some((component: any) =>
      component.type === 2 || component.data?.type === 2, // ButtonComponent type
    );

    if (newRowHasButtons) {
      const filteredComponents = components.filter((row) => {
        const hasButtons = row.components?.some((component: any) =>
          component.type === 2 || component.data?.type === 2,
        );
        return !hasButtons;
      });
      return [...filteredComponents, newRow];
    }

    return [...components, newRow];
  }
}
