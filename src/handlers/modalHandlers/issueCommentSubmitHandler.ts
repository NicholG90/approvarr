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

    // Get the media ID from the embed
    const mediaIdField = interaction.message.embeds[0].fields.find(
        (field) => field.name === 'Media ID',
    );

    if (!mediaIdField) {
        console.error('Media ID field not found.');
        return;
    }

    // Check for season and episode information for TV shows
    const seasonField = interaction.message.embeds[0].fields.find(
        (field) => field.name === 'Season',
    );
    const episodeField = interaction.message.embeds[0].fields.find(
        (field) => field.name === 'Episode',
    );

    const requestBody: any = {
        issueType: issueTypeValue,
        message: modalCommentInput,
        mediaId: parseInt(mediaIdField.value, 10),
    };

    // Add season and episode information if available (for TV shows)
    if (seasonField) {
        const seasonNumber = seasonField.value.replace('Season ', '');
        const parsedSeason = parseInt(seasonNumber, 10);
        if (!isNaN(parsedSeason)) {
            requestBody.season = parsedSeason;
        }
    }

    if (episodeField && episodeField.value !== 'Entire Season') {
        const episodeNumber = episodeField.value.replace('Episode ', '');
        const parsedEpisode = parseInt(episodeNumber, 10);
        if (!isNaN(parsedEpisode)) {
            requestBody.episode = parsedEpisode;
        }
    }
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
    await updateEmbed(interaction.message, mediaIdField, interaction, 'report');
}
