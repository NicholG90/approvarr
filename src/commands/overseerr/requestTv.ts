import { SlashCommandBuilder } from 'discord.js';
import { executeMediaRequest } from '../../helpers/mediaRequestHelper.js';

export const data = new SlashCommandBuilder()
  .setName('request_tv')
  .setDescription('Request a TV series from Overseerr')
  .addStringOption(option => option
    .setName('tv_title')
    .setDescription('Enter the TV Series you are requesting')
    .setRequired(true));

export async function execute(interaction: any) {
  await executeMediaRequest(interaction, 'tv');
}
