import type { Interaction } from 'discord.js';
import { MessageFlags } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi.js';
import { updateEmbed } from '../../outbound/updateButtons.js';

export async function issueCommentResponseHandler(interaction: Interaction) {
  if (!interaction.isModalSubmit())
    return;
  const modalCommentInput = interaction.fields.getTextInputValue('commentInput');

  const messageToPost = {
    message: modalCommentInput,
  };

  if (!interaction.message) {
    console.error('Interaction Message not found.');
    return;
  }
  const buttonID = interaction.message.embeds[0].fields.find(
    field => field.name === 'Request ID' || field.name === 'Issue ID',
  );
  if (!buttonID) {
    console.error('Request ID or Issue ID field not found.');
    return;
  }

  const uniqueId = buttonID.value;

  const url = `/issue/${uniqueId}/comment`;
  const apiResponse = await overseerrApi(url, 'POST', JSON.stringify(messageToPost));
  if (apiResponse.status !== 200) {
    await interaction.reply({
      content: 'Your comment was not submitted successfully - Check the logs!',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  await updateEmbed(interaction.message, interaction, 'comment');
}
