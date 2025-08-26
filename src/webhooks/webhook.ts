import type { Client } from 'discord.js';
import type { WebhookPayload } from '../interfaces/notifications.js';
import * as dotenv from 'dotenv';
import express from 'express';
import { filterWebhook } from '../helpers/filterWebhook.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || '3000';

export function handleWebhook(client: Client) {
  app.use(express.json());

  app.listen(PORT, () => {
    console.info(`Listening on port ${PORT}`);
  });
  app.post('/webhook', async (req: any, res: any) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send('No webhook data received or empty payload.');
    }

    try {
      const payload = req.body as WebhookPayload;
      await filterWebhook(client, payload);

      return res.status(200).send('Webhook data processed successfully.');
    }
    catch (error) {
      console.error('Error processing webhook:', error);
      return res.status(500).send('Error processing webhook data.');
    }
  });
}
