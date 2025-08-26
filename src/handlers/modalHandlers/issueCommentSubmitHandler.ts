import type { Interaction } from 'discord.js';
import { MessageFlags } from 'discord.js';
import { issueType } from '../../constants/issuesData.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi.js';
import { getDiscordUserIds } from '../../helpers/getDiscordUserIds.js';
import { updateEmbed } from '../../outbound/updateButtons.js';

export async function issueCommentSubmitHandler(interaction: Interaction) {
  if (!interaction.isModalSubmit())
    return;

  const issueTypeId = interaction.customId.split('-')[1];
  const issueTypeValue = issueType[issueTypeId.toUpperCase() as keyof typeof issueType];
  const modalCommentInput = interaction.fields.getTextInputValue('issueReportComment');

  if (!interaction.message) {
    console.error('Interaction Message not found.');
    return;
  }

  const users = await getDiscordUserIds();
  const overseerrId = Object.keys(users).find((key: any) => users[key] === interaction.user.id);

  if (!overseerrId) {
    await interaction.reply({
      content: 'Your discord ID is not linked to an Overseerr account.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const internalIdField = interaction.message.embeds[0].fields.find(
    field => field.name === 'Internal ID',
  );
  const mediaIdField = interaction.message.embeds[0].fields.find(
    field => field.name === 'Media ID',
  );

  const idField = internalIdField || mediaIdField;
  if (!idField) {
    console.error('Media ID field not found.');
    return;
  }

  const seasonField = interaction.message.embeds[0].fields.find(
    field => field.name === 'Season',
  );
  const episodeField = interaction.message.embeds[0].fields.find(
    field => field.name === 'Episode',
  );

  const requestBody: any = {
    issueType: issueTypeValue,
    message: modalCommentInput,
    mediaId: Number.parseInt(idField.value, 10),
  };

  if (seasonField) {
    const seasonNumber = seasonField.value.replace('Season ', '');
    const parsedSeason = Number.parseInt(seasonNumber, 10);
    if (!Number.isNaN(parsedSeason)) {
      requestBody.problemSeason = parsedSeason;
    }
  }

  if (episodeField && episodeField.value !== 'Entire Season') {
    const episodeNumber = episodeField.value.replace('Episode ', '');
    const parsedEpisode = Number.parseInt(episodeNumber, 10);
    if (!Number.isNaN(parsedEpisode)) {
      requestBody.problemEpisode = parsedEpisode;
    }
  }
  const url = `/issue`;

  try {
    const apiResponse = await overseerrApi(url, 'POST', requestBody, Number.parseInt(overseerrId, 10));
    if (apiResponse.status !== 200) {
      await interaction.reply({
        content: 'Your comment was not submitted successfully - Check the logs!',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    await updateEmbed(interaction.message, interaction, 'report');
  }
  catch (error) {
    console.error('Error submitting issue report:', error);
    await interaction.reply({
      content: 'Your comment was not submitted successfully - Check the logs!',
      flags: MessageFlags.Ephemeral,
    });
  }
}
