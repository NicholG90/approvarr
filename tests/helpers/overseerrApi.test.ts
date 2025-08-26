import axios from 'axios';
import { overseerrApi } from '../../src/helpers/apis/overseerr/overseerrApi.js';

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.MockedFunction<typeof axios>;

describe('overseerr API Integration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.OVERSEERR_URL = 'http://localhost:5055';
    process.env.OVERSEERR_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should make successful GET request', async () => {
    const mockResponse = { data: { id: 1, name: 'Test' } };
    mockAxios.mockResolvedValueOnce(mockResponse);

    const result = await overseerrApi('/test', 'GET');

    expect(mockAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: 'http://localhost:5055/api/v1/test',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'test-api-key',
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should make successful POST request with body', async () => {
    const mockResponse = { data: { success: true } };
    const requestBody = { mediaType: 'movie', mediaId: 123 };
    mockAxios.mockResolvedValueOnce(mockResponse);

    const result = await overseerrApi('/request', 'POST', requestBody);

    expect(mockAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:5055/api/v1/request',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'test-api-key',
      },
      data: requestBody,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should include user ID in headers when provided', async () => {
    const mockResponse = { data: { success: true } };
    mockAxios.mockResolvedValueOnce(mockResponse);

    await overseerrApi('/test', 'GET', undefined, 123);

    expect(mockAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: 'http://localhost:5055/api/v1/test',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'test-api-key',
        'X-API-User': '123',
      },
    });
  });

  it('should throw error when API key is missing', async () => {
    delete process.env.OVERSEERR_API_KEY;

    await expect(overseerrApi('/test', 'GET')).rejects.toThrow(
      'Overseerr API key is not defined in environment variables',
    );

    expect(mockAxios).not.toHaveBeenCalled();
  });

  it('should throw error when URL is missing', async () => {
    delete process.env.OVERSEERR_URL;

    await expect(overseerrApi('/test', 'GET')).rejects.toThrow(
      'Overseerr URL is not defined in environment variables',
    );

    expect(mockAxios).not.toHaveBeenCalled();
  });

  it('should handle API errors and re-throw them', async () => {
    const apiError = new Error('API Error');
    mockAxios.mockRejectedValueOnce(apiError);

    await expect(overseerrApi('/test', 'GET')).rejects.toThrow('API Error');

    expect(mockAxios).toHaveBeenCalled();
  });

  it('should handle different HTTP methods', async () => {
    const mockResponse = { data: { success: true } };
    mockAxios.mockResolvedValue(mockResponse);

    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

    for (const method of methods) {
      await overseerrApi('/test', method);

      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          method,
          url: 'http://localhost:5055/api/v1/test',
        }),
      );
    }

    expect(mockAxios).toHaveBeenCalledTimes(methods.length);
  });

  it('should properly construct URLs with different paths', async () => {
    const mockResponse = { data: {} };
    mockAxios.mockResolvedValue(mockResponse);

    const testCases = [
      '/search',
      '/user/123',
      '/request/',
      '/user/123/quota?days=7',
    ];

    for (const path of testCases) {
      await overseerrApi(path, 'GET');

      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `http://localhost:5055/api/v1${path}`,
        }),
      );
    }
  });

  it('should handle empty request body correctly', async () => {
    const mockResponse = { data: {} };
    mockAxios.mockResolvedValueOnce(mockResponse);

    await overseerrApi('/test', 'POST');

    expect(mockAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:5055/api/v1/test',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'test-api-key',
      },
    });
  });

  it('should handle complex request bodies', async () => {
    const mockResponse = { data: {} };
    const complexBody = {
      mediaType: 'tv',
      mediaId: 456,
      seasons: [
        { seasonNumber: 1 },
        { seasonNumber: 2 },
      ],
      metadata: {
        source: 'discord',
        requestedBy: 'user123',
      },
    };
    mockAxios.mockResolvedValueOnce(mockResponse);

    await overseerrApi('/request', 'POST', complexBody, 789);

    expect(mockAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:5055/api/v1/request',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'test-api-key',
        'X-API-User': '789',
      },
      data: complexBody,
    });
  });
});
