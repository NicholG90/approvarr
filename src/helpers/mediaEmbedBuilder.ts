import type { Interaction } from 'discord.js';
import { EmbedColors } from '../constants/notificationData.js';
import { overseerrApi } from './apis/overseerr/overseerrApi.js';

interface MediaInfo {
  id: number;
  name?: string;
  title?: string;
  overview: string;
  posterPath: string;
  firstAirDate?: string;
  releaseDate?: string;
  mediaInfo?: {
    id: number;
    status: number;
  };
}

export async function mediaEmbedBuilder(interaction: Interaction): Promise<any> {
  if (!interaction.isStringSelectMenu())
    return null;

  try {
    const mediaType = interaction.values[0].split('-')[1].trim();
    let internalMediaId = null;

    if (interaction.customId === 'issueReportMedia') {
      internalMediaId = interaction.values[0].split('-')[2].trim();
    }

    const mediaId = interaction.values[0].split('-')[0].trim();
    const response = await overseerrApi(`/${mediaType}/${mediaId}`, 'GET');
    const mediaInfo: MediaInfo = response.data;

    const year = mediaType === 'tv'
      ? mediaInfo.firstAirDate?.split('-')[0]
      : mediaInfo.releaseDate?.split('-')[0];

    const displayName = `${mediaType === 'tv' ? mediaInfo.name : mediaInfo.title} (${year})`;

    const mediaEmbed = {
      title: displayName,
      url: `${process.env.OVERSEERR_URL}/${mediaType}/${mediaInfo.id}`,
      color: EmbedColors.GREEN,
      fields: [
        {
          name: 'Description',
          value: mediaInfo.overview || 'No description available',
        },
        {
          name: 'Media ID',
          value: mediaInfo.id.toString(),
          inline: true,
        },
        ...(internalMediaId
          ? [{
            name: 'Internal ID',
            value: internalMediaId,
            inline: true,
          }]
          : []),
        {
          name: mediaType === 'tv' ? 'First Air Date' : 'Release Date',
          value: mediaType === 'tv' ? (mediaInfo.firstAirDate || 'Unknown') : (mediaInfo.releaseDate || 'Unknown'),
          inline: true,
        },
      ],
      thumbnail: {
        url: `https://image.tmdb.org/t/p/w500${mediaInfo.posterPath}`,
      },
    };

    return mediaEmbed;
  }
  catch (error) {
    console.error('Error building media embed:', error);
    return null;
  }
}
