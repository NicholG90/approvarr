import { overseerrApi } from './apis/overseerr/overseerrApi.js';

/**
 * Fetches detailed information about a request from Overseerr API
 *
 * @param requestId The request ID to fetch information for
 * @returns Request information including user details, or null if not found/error
 */
export async function getRequestDetails(requestId: string): Promise<any> {
  try {
    if (!requestId) {
      return null;
    }

    const requestResponse = await overseerrApi(`/request/${requestId}`, 'GET');
    if (requestResponse.status === 200) {
      return requestResponse.data;
    }
    return null;
  }
  catch (error) {
    console.error('Error fetching request details:', error);
    return null;
  }
}
