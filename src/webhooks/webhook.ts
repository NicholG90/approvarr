// Import the necessary modules
import express from 'express';
import { Client } from 'discord.js';
import * as dotenv from 'dotenv';
import { filterWebhook } from '../helpers/filterWebhook';
import { WebhookPayload } from '../interfaces/notifications';

dotenv.config();

// Create an Express application
const app = express();
// Get the port from the environment variables
const { PORT } = process.env;

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
        } catch (error) {
            console.error('Error processing webhook:', error);
            return res.status(500).send('Error processing webhook data.');
        }
    });
}
