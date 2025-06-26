import { StringSelectMenuOptionBuilder, EmbedBuilder } from 'discord.js';
import { TvSeason } from '../interfaces/overseerr';

export class UIUtils {
  static createSeasonOptions(seasons: TvSeason[]): StringSelectMenuOptionBuilder[] {
    const validSeasons = seasons.filter(season => season.seasonNumber > 0);
    return validSeasons.map(season => 
      new StringSelectMenuOptionBuilder()
        .setLabel(`Season ${season.seasonNumber}`)
        .setValue(season.seasonNumber.toString())
        .setDescription(`${season.episodeCount || 0} episodes`)
    );
  }

  static createEpisodeOptions(episodes: any[]): StringSelectMenuOptionBuilder[] {
    return episodes.map(episode => {
      const episodeNum = episode.episode_number || episode.episodeNumber;
      const episodeName = episode.name || `Episode ${episodeNum}`;
      const overview = episode.overview ? 
        (episode.overview.length > 60 ? episode.overview.substring(0, 60) + '...' : episode.overview) : 
        'No description available';
      
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
        .setDescription(`Episode ${i + 1}`)
    );
  }

  static formatMediaLabel(media: any, mediaType?: string): string {
    const type = mediaType || media.mediaType;
    if (type === 'tv' && media.name) {
      return `${media.name} (${media.firstAirDate?.split('-')[0] || 'Unknown'})`;
    }
    return `${media.title || 'Unknown Title'} (${media.releaseDate?.split('-')[0] || 'Unknown'})`;
  }

  static extractMediaId(mediaEmbed: EmbedBuilder): string {
    const mediaIdField = mediaEmbed.data.fields?.find(field => field.name === 'Media ID');
    if (!mediaIdField) {
      throw new Error('Media ID not found in embed');
    }
    return mediaIdField.value;
  }

  static preserveComponents(existingComponents: any[], newRow: any) {
    return [...(existingComponents || []), newRow];
  }
}