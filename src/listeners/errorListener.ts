import type { Client } from 'discord.js';

export function errorListener(client: Client) {
  client.on('error', (error) => {
    console.error('Unhandled error:', error);
  });
}
