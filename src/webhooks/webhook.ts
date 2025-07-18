import type { Client } from 'discord.js';
import type { WebhookPayload } from '../interfaces/notifications';
import * as dotenv from 'dotenv';
// Import the necessary modules
import express from 'express';
import { filterWebhook } from '../helpers/filterWebhook';

dotenv.config();

// Create an Express application
const app = express();
// Get the port from the environment variables, default to 3000
const PORT = process.env.PORT || '3000';

export function handleWebhook(client: Client) {
  // Apply the JSON middleware to parse the request body
  app.use(express.json());

  // Start an HTTP server for receiving webhooks
  app.listen(PORT, () => {
    console.info(`Listening on port ${PORT}`);
  });
  // Define a POST route for the webhook
  app.post('/webhook', async (req: any, res: any) => {
    // Verify that the request contains data
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send('No webhook data received or empty payload.');
    }

    try {
      const payload = req.body as WebhookPayload;
      await filterWebhook(client, payload);

      // Send a response to the webhook source
      return res.status(200).send('Webhook data processed successfully.');
    }
    catch (error) {
      console.error('Error processing webhook:', error);
      return res.status(500).send('Error processing webhook data.');
    }
  });
}
