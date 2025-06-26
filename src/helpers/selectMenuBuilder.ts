import type { StringSelectMenuOptionBuilder } from 'discord.js';
import { StringSelectMenuBuilder } from 'discord.js';

/**
 * Creates a select menu with dynamic placeholder based on current selection
 * @param customId The custom ID for the select menu
 * @param options The options for the select menu
 * @param defaultPlaceholder The default placeholder when no selection is made
 * @param currentSelection The current selected value (if any)
 * @param currentSelectionLabel The display label for the current selection
 * @returns Configured StringSelectMenuBuilder
 */
export function createSelectMenuWithPlaceholder(
  customId: string,
  options: StringSelectMenuOptionBuilder[],
  defaultPlaceholder: string,
  currentSelection?: string,
  currentSelectionLabel?: string,
): StringSelectMenuBuilder {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .addOptions(...options);

  if (currentSelection && currentSelectionLabel) {
    selectMenu.setPlaceholder(`✓ ${currentSelectionLabel}`);
  }
  else {
    selectMenu.setPlaceholder(defaultPlaceholder);
  }

  return selectMenu;
}

/**
 * Extracts current selection information from embed fields
 * @param embed The message embed
 * @param fieldName The name of the field to extract
 * @returns Object with value and label, or null if not found
 */
export function extractCurrentSelection(embed: any, fieldName: string): { value: string; label: string } | null {
  const field = embed.fields?.find((f: any) => f.name === fieldName);
  if (!field)
    return null;

  return {
    value: field.value,
    label: field.value,
  };
}

/**
 * Extracts media selection from the first component in the message
 * @param components The message components
 * @returns Object with current media info or null
 */
export function extractMediaSelection(components: any[]): { value: string; label: string } | null {
  if (!components || components.length === 0)
    return null;

  const firstComponent = components[0];
  if (!firstComponent.components || firstComponent.components.length === 0)
    return null;

  const selectMenu = firstComponent.components[0];
  if (selectMenu.type !== 3)
    return null; // Not a select menu

  // Try to extract from placeholder if it shows a selection
  const placeholder = selectMenu.placeholder;
  if (placeholder && placeholder.startsWith('Selected: ')) {
    return {
      value: placeholder.replace('Selected: ', ''),
      label: placeholder.replace('Selected: ', ''),
    };
  }

  return null;
}

/**
 * Updates the placeholder of a specific select menu in the components array
 * @param components The message components array
 * @param customId The custom ID of the select menu to update
 * @param newPlaceholder The new placeholder text
 * @returns Updated components array
 */
export function updateSelectMenuPlaceholder(components: any[], customId: string, newPlaceholder: string): any[] {
  return components.map((component) => {
    if (component.components) {
      const updatedComponents = component.components.map((comp: any) => {
        if (comp.data && comp.data.custom_id === customId) {
          return {
            ...comp,
            data: {
              ...comp.data,
              placeholder: newPlaceholder,
            },
          };
        }
        return comp;
      });
      return {
        ...component,
        components: updatedComponents,
      };
    }
    return component;
  });
}

/**
 * Gets the media title from an embed for use in placeholders
 * @param embed The embed containing media information
 * @returns The media title or 'Selected Media'
 */
export function getMediaTitleFromEmbed(embed: any): string {
  if (embed.title) {
    // Truncate if too long for placeholder
    return embed.title.length > 30 ? `${embed.title.substring(0, 27)}...` : embed.title;
  }
  return 'Selected Media';
}
