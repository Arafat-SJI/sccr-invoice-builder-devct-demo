import { apiClient } from './client';

/**
 * Fetches the health status from the backend API.
 * Uses the shared Axios client configured with NEXT_PUBLIC_API_URL.
 *
 * Returns 'OK' when the backend responds with 200.
 * Otherwise, returns an error message describing the issue.
 */
export async function getHealthStatus(): Promise<string> {
  try {
    // Base URL should already include /api, so we call /health here
    const response = await apiClient.get('/health');
    if (response.status === 200) {
      return 'OK';
    }
    return `Error: Backend responded with status ${response.status}`;
  } catch (error: any) {
    if (error?.response) {
      return `Error: ${error.response.status} - ${error.response.statusText || 'Server Error'}`;
    }
    if (error?.request) {
      return 'Error: No response from backend. Server might be down or unreachable.';
    }
    return `Error: ${error?.message || 'Unknown error'}`;
  }
}
