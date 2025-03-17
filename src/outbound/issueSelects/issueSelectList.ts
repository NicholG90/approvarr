// Import the necessary modules
import {
    ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, CommandInteraction,
    MessageFlags,
} from 'discord.js';
import { OverseerrSearchMediaResults } from '../../interfaces/overseerr';

export async function issueSelectList(
    interaction: CommandInteraction,
    mediaArray: OverseerrSearchMediaResults[],
) {
    const options = mediaArray.map((media) => {
        const label = media.mediaType === 'tv' && media.name
            ? `${media.name} (${media.firstAirDate?.split('-')[0]})`
            : media.title ? `${media.title} (${media.releaseDate?.split('-')[0]})` : 'Unknown Title';
        return new StringSelectMenuOptionBuilder()
            .setLabel(label)
            .setValue(`${media.id.toString()}-${media.mediaType.toString()}-${media.mediaInfo.id.toString()}`);
    });
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('issueReportMedia')
        .setPlaceholder('What media would you like to report an issue with?')
        .addOptions(...options);
    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(selectMenu);
    await interaction.reply({
        content: `Please select the media with an issue:`,
        components: [row],
        flags: MessageFlags.Ephemeral,
    });
}
