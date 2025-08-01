import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import axios from 'axios';

export async function overseerrApi(
  url: string,
  method: Method,
  requestBody?: any,
  userId?: number,
): Promise<AxiosResponse> {
  const apiUrl = `${process.env.OVERSEERR_URL}/api/v1${url}`;
  const apiKey = process.env.OVERSEERR_API_KEY || '';

  if (!apiKey) {
    throw new Error('Overseerr API key is not defined in environment variables');
  }

  if (!process.env.OVERSEERR_URL) {
    throw new Error('Overseerr URL is not defined in environment variables');
  }

  try {
    // Set the request headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    };

    // Add user ID if provided
    if (userId) {
      headers['X-API-User'] = userId.toString();
    }

    // Configure the request
    const config: AxiosRequestConfig = {
      method,
      url: apiUrl,
      headers,
      ...(requestBody && { data: requestBody }),
    };

    // Send the request to the Overseerr API
    const response = await axios(config);
    return response;
  }
  catch (error) {
    console.error('Error calling Overseerr API:', error);
    throw error;
  }
}
