import { Interaction, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';

export async function mediaRequestSubmitHandler(interaction: Interaction, mediaEmbed: any) {
    if (!interaction.isStringSelectMenu()) return;
    const mediaType = interaction.values[0].split('-')[1].trim();
    const mediaId = interaction.values[0].split('-')[0].trim();

    const mediaInfo = (await overseerrApi(`/${mediaType}/${mediaId}`, 'get')).data;
    mediaInfo.name = `
    ${mediaInfo.name} (${mediaType === 'tv'
    ? mediaInfo.firstAirDate?.split('-')[0]
    : mediaInfo.releaseDate?.split('-')[0]})
    `;
    const requestButton = new ButtonBuilder()
        .setCustomId('requestMedia')
        .setLabel('Request')
        .setStyle(ButtonStyle.Primary);
    const mediaExists = new ButtonBuilder()
        .setCustomId('mediaExists')
        .setDisabled(true)
        .setLabel('Media Exists')
        .setStyle(ButtonStyle.Danger);
    const requestExists = new ButtonBuilder()
        .setCustomId('requestExists')
        .setDisabled(true)
        .setLabel('Request Exists')
        .setStyle(ButtonStyle.Danger);

    let row;
    if (mediaInfo && mediaInfo.mediaInfo && mediaInfo.mediaInfo.status >= 4) {
        row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(mediaExists);
    } else if (mediaInfo && mediaInfo.mediaInfo && mediaInfo.mediaInfo.status > 1) {
        row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(requestExists);
    } else {
        row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(requestButton);
    }
    // Preserve all existing select menus and add the button row
    const existingComponents = interaction.message.components || [];
    const allComponents = [...existingComponents, row];
    
    await interaction.update({
        embeds: [mediaEmbed],
        components: allComponents,
    });
}
