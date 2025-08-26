import type { Client } from 'discord.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REST, Routes } from 'discord.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export async function commandRegister(client: Client, token: string, serverID: string) {
  const rest = new REST().setToken(token);
  const foldersPath = path.join(dirname, '../commands');

  try {
    const commandFolders = await fs.readdir(foldersPath);

    const commands = await Promise.all(commandFolders.map(async (folder) => {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = await fs.readdir(commandsPath);

      return Promise.all(commandFiles
        .filter(file => file.endsWith('.js'))
        .filter(file => !file.startsWith('unused'))
        .map(async (file) => {
          const filePath = path.join(commandsPath, file);
          const commandModule = await import(filePath);
          const command = commandModule.default || commandModule;

          if ('data' in command && 'toJSON' in command.data) {
            const commandData = command.data.toJSON();

            if (commandData.name === 'quota_status' && process.env.ENABLE_QUOTA_CHECK !== 'true') {
              console.info('[INFO] Skipping quota_status command registration (ENABLE_QUOTA_CHECK is not true)');
              return null;
            }

            return commandData;
          }
          return null;
        }));
    }));

    const flatCommands = commands.flat().filter(Boolean);

    console.info('Started refreshing application (/) commands.');

    if (!client.user) {
      console.error('Client user is null or undefined.');
      return;
    }
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, serverID),
      { body: flatCommands },
    );

    console.info('Successfully reloaded application (/) commands.');
  }
  catch (error) {
    console.error('Error loading commands:', error);
  }
}
