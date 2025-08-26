import { overseerrApi } from './apis/overseerr/overseerrApi.js';

export async function fetchSeasonEpisodes(mediaId: string, seasonNumber: string): Promise<any[]> {
  try {
    const response = await overseerrApi(`/tv/${mediaId}/season/${seasonNumber}`, 'GET');
    return response.data.episodes || [];
  }
  catch (error) {
    console.error(`Error fetching season ${seasonNumber} episodes for media ${mediaId}:`, error);
    return [];
  }
}
