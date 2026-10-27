/**
 * Node.js script to test the backend health endpoint.
 * Uses native fetch (Node 18+) to call http://localhost:5000/api/health
 * and logs the response status and body.
 */

const API_URL = 'http://localhost:5000/api/health';

async function testHealthEndpoint() {
  console.log(`Attempting to reach backend health endpoint at ${API_URL}`);
  try {
    const response = await fetch(API_URL, { method: 'GET' });

    const contentType = response.headers.get('content-type') || '';
    let bodyText = '';
    try {
      if (contentType.includes('application/json')) {
        const json = await response.json();
        bodyText = JSON.stringify(json);
      } else {
        bodyText = await response.text();
      }
    } catch (e) {
      // ignore body parsing errors; keep going
    }

    if (response.ok) {
      console.log(`✅ Health check successful! Status: ${response.status} ${response.statusText || ''}`.trim());
      if (bodyText) {
        console.log('Response body:', bodyText);
      }
      process.exit(0);
    } else {
      console.error(`❌ Health check failed! Status: ${response.status} ${response.statusText || ''}`.trim());
      if (bodyText) {
        console.error('Error response body:', bodyText);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error during health check: ${error?.message || error}`);
    console.error('This often means the backend server is not running or is unreachable.');
    process.exit(1);
  }
}

testHealthEndpoint();
