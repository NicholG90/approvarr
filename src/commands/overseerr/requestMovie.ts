import { SlashCommandBuilder } from 'discord.js';
import { executeMediaRequest } from '../../helpers/mediaRequestHelper.js';

export const data = new SlashCommandBuilder()
  .setName('request_movie')
  .setDescription('Request a movie from Overseerr')
  .addStringOption(option => option
    .setName('movie_title')
    .setDescription('Enter the movie you are requesting')
    .setRequired(true));

export async function execute(interaction: any) {
  await executeMediaRequest(interaction, 'movie');
}
