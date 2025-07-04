// Scenario 2: As an admin user I must be able to create a new content ID with content type as Live and genre as sport 
// and validate the new content ID can be retrivided when we make a GET to specific end point and valid response

import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import ADMIN_TOKEN from "../test-data/auth_token_data";

const statuses = JSON.parse(readFileSync(join(__dirname, '../test-data/content_statuses.json'), 'utf-8'));
function getRandomStatus() {
  return statuses[Math.floor(Math.random() * statuses.length)];
}

const randomSport = JSON.parse(readFileSync(join(__dirname, '../test-data/random_data_content_title.json'), 'utf-8'));
function getRandomSport() {
  return randomSport[Math.floor(Math.random() * randomSport.length)];
}

//Test to create a new content ID and perform further validations
test('Validate a new contentID can be created and retrived using the GET Request by ID', async ({ request }) => {
 const authHeaders = { Authorization: `Bearer ${ADMIN_TOKEN['user_1']['token']}` };

  // Create test data for the below request body
  const sport = getRandomSport();
  const status = getRandomStatus();

  // Request bidy for new content ID is here  
  const contentRequest = {
    title: `Live Sport- ${sport}`,
    description: `Watch Live ${sport} here`,
    type: 'live',
    status,
    thumbnail: 'https://example.com/thumbnails/concert.jpg',
    duration: 5400,
    metadata: {
      genre: 'Sport',
      language: 'en',
      ageRating: 'PG-12'
    }
  };

  // 1. Create new content
  const newContentResponse = await request.post("/api/content", {
    headers: {
  ...authHeaders,
  'Content-Type': 'application/json'
  },
  data: contentRequest
  });

  console.log('Status:', newContentResponse.status());
console.log('Body:', await newContentResponse.text());

  expect(newContentResponse.ok()).toBeTruthy();
  const createdContent = await newContentResponse.json();

  expect(createdContent).toHaveProperty('id');
  expect(createdContent).toHaveProperty('createdAt');
  expect(createdContent.title).toBe(`Live Sport- ${sport}`);
  expect(createdContent.description).toBe(`Watch Live ${sport} here`);
  expect(createdContent.status.toLowerCase()).toBe(status);
  expect(createdContent.metadata.genre).toBe('Sport');

  const newContentID = createdContent.id;

  // Validate get request by new content ID responds with new content data
  const getResNewContentID = await request.get(`/api/content/${newContentID}`, {
   headers: {
  ...authHeaders,
  'Content-Type': 'application/json'
}
  });

  console.log( await getResNewContentID.json());

  expect(getResNewContentID.ok()).toBeTruthy();
  const getByIDResponse = await getResNewContentID.json();

  expect(getByIDResponse.id).toBe(newContentID); // response id mataches the new content ID
  expect(getByIDResponse.title).toBe(`Live Sport- ${sport}`); // resposne title matchec the new content title
  expect(getByIDResponse.description).toBe(`Watch Live ${sport} here`); // response description matches the new content description
  expect(getByIDResponse.status.toLowerCase()).toBe(status); // response status matches the new content status
  expect(getByIDResponse.metadata.genre).toBe('Sport'); // response genre matches the new content genre
  expect(getByIDResponse).toHaveProperty('createdAt');  // response createdAt property exists
});
