// Scenario 1: As an admin user I must be able to retrieve all the contents when they make a request to endpoint
// and validate that the API endpoint for retrieving all contents works correctly and returns the expected data structure.
const { test, expect } = require('@playwright/test');

const ADMIN_TOKEN = require ("../test-data/auth_token_data");

test('User is able to GET all the contents when they make a request to endpoint', async ({ request }) => {
  const authHeaders = { Authorization: `Bearer ${ADMIN_TOKEN['user_1']['token']}` };

  // Make a Request to GET Content 
  const getContentResponse = await request.get("/api/content", { headers: authHeaders });

  // Test to validate response is OK
  console.log(await getContentResponse.json());
  expect(getContentResponse.ok()).toBeTruthy();
  expect(getContentResponse.status()).toBe(200);

  // Test to Validate the response is an array
const contentResponse = await getContentResponse.json();
  expect(Array.isArray(contentResponse)).toBe(true);

  // Test to Validate array has items and each item has a unique id
  const ids = new Set();
  for (const item of contentResponse) {
    expect(item).toHaveProperty('id');
    ids.add(item.id);
  }
  expect(ids.size,'Expected all IDs to be unique').toBe(contentResponse.length); 
  // All IDs are unique
});