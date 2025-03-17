import { Interaction, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, MessageFlags } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';
import { getDiscordUserIds } from '../../helpers/getDiscordUserIds';
import { updateEmbed } from '../../outbound/updateButtons';
import { issueType } from '../../constants/issuesData';

export async function issueCommentSubmitHandler(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;

    const issueTypeId = interaction.customId.split('-')[1];
    const issueTypeValue = issueType[issueTypeId.toUpperCase() as keyof typeof issueType];
    const modalCommentInput = interaction.fields.getTextInputValue('issueReportComment');

    if (!interaction.message) {
        console.error('Interaction Message not found.');
        return;
    }

    // use overseerr API to get user's overseerr ID
    const users = await getDiscordUserIds();
    // look for interaction.user.id in the values of the users object
    const overseerrId = Object.keys(users).find((key: any) => users[key] === interaction.user.id);

    if (!overseerrId) {
        // if the user's discord ID is not found in the users object, return an error
        await interaction.reply({
            content: 'Your discord ID is not linked to an Overseerr account.',
            flags: MessageFlags.Ephemeral
        });
        return;
    }

    // Get the media title from the embed
    const mediaTitle = interaction.message.embeds[0].fields.find(
        (field) => field.name === 'Media ID',
    );

    if (!mediaTitle) {
        console.error('Media ID field not found.');
        return;
    }
    const requestBody = {
        issueType: issueTypeValue,
        message: modalCommentInput,
        mediaId: parseInt(mediaTitle.value, 10),
    };
    const url = `/issue`;
    const apiResponse = await overseerrApi(url, 'POST', requestBody, parseInt(overseerrId, 10));
    // check if the response was received successfull
    if (apiResponse.status !== 200) {
        await interaction.reply({
            content: 'Your comment was not submitted successfully - Check the logs!',
            flags: MessageFlags.Ephemeral,
        });
        return;
    }
    await updateEmbed(interaction.message, mediaTitle, interaction, 'report');
}
