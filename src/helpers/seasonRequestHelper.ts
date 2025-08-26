import type { TvSeason } from '../interfaces/overseerr.js';

/**
 * Formats season selection for display in embeds
 * @param selectedSeasons Array of selected season values
 * @returns Formatted string for display
 */
export function formatSelectedSeasons(selectedSeasons: string[]): string {
  if (selectedSeasons.includes('all')) {
    return 'All Seasons';
  }

  const seasonNumbers = selectedSeasons
    .filter(season => season !== 'all')
    .map(season => Number.parseInt(season, 10))
    .filter(num => !Number.isNaN(num))
    .sort((a, b) => a - b);

  if (seasonNumbers.length === 0) {
    return 'Season 1'; // Default fallback
  }

  return seasonNumbers.map(num => `Season ${num}`).join(', ');
}

/**
 * Converts season selection to the format expected by Overseerr API
 * @param selectedSeasons Array of selected season values
 * @returns Season data for API request
 */
export function prepareSeasonRequestData(selectedSeasons: string[]): any {
  if (selectedSeasons.includes('all')) {
    return 'all';
  }

  const seasonNumbers = selectedSeasons
    .filter(season => season !== 'all')
    .map(season => Number.parseInt(season, 10))
    .filter(num => !Number.isNaN(num));

  if (seasonNumbers.length === 0) {
    return [1]; // Default to season 1
  }

  return seasonNumbers;
}

/**
 * Validates that selected seasons are available for the TV series
 * @param selectedSeasons Array of selected season values
 * @param availableSeasons Available seasons from TV data
 * @returns Object with validation result and error message if invalid
 */
export function validateSeasonSelection(
  selectedSeasons: string[],
  availableSeasons?: TvSeason[],
): { isValid: boolean; errorMessage?: string } {
  if (!selectedSeasons || selectedSeasons.length === 0) {
    return { isValid: false, errorMessage: 'No seasons selected' };
  }

  if (selectedSeasons.includes('all')) {
    return { isValid: true };
  }

  if (!availableSeasons || availableSeasons.length === 0) {
    return { isValid: true }; // Allow if we can't validate against available seasons
  }

  const seasonNumbers = selectedSeasons
    .map(season => Number.parseInt(season, 10))
    .filter(num => !Number.isNaN(num));

  const availableSeasonNumbers = availableSeasons
    .filter(season => season.seasonNumber > 0)
    .map(season => season.seasonNumber);

  const invalidSeasons = seasonNumbers.filter(num => !availableSeasonNumbers.includes(num));

  if (invalidSeasons.length > 0) {
    return {
      isValid: false,
      errorMessage: `Selected seasons not available: ${invalidSeasons.join(', ')}`,
    };
  }

  return { isValid: true };
}
