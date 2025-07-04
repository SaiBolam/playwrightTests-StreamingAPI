//Scenario 4: As an admin user I must be able to identify a live streaming content and verify the streaming end time is already past the current time 
// then stop the live streaming and validate the content is no longer live and status of the streaming is inactive.

//if the test cannot find a stream with endTime > current time - 2 hours, it will skip the test with a message.
// This test needs to ensure that the streaming service can correctly identify and stop a live stream.
//And health of the stream is updated correctly otherwise it will report of the specific issues such as there still active viewers after the stream is stopped. 


const { test, expect } = require('@playwright/test');

const ADMIN_TOKEN = require ("../test-data/auth_token_data");

const { streamEndTimeCalcISOString } = require('../test-data/stream_endTime_calc');

test('Identify a live stream and verify the streaming time is ended and then stop streaming', async ({ request }) => {
  const authHeaders = { Authorization: `Bearer ${ADMIN_TOKEN['user_1']['token']}` };

  // 1. Identify and get the list of all streams
  const streamsRes = await request.get(`/api/streams`, { headers: authHeaders });
  expect(streamsRes.ok()).toBeTruthy();
  const streams = await streamsRes.json();
  expect(Array.isArray(streams)).toBe(true);

  // 2. Find a stream whose endTime > current time - 2 hours
  const threshold = streamEndTimeCalcISOString();
  const candidate = streams.find(s => s.endTime && s.endTime > threshold);
  if (!candidate) {
    test.skip(true, 'Exiting test as no stream found which is live with the search criteria (endTime > current time - 2 hours)');
    return;
  }
  const stopStreamID = candidate.id;
  // 3. Verify the health of the stopStreamID
  const healthRes = await request.get(`/api/streams/${stopStreamID}/health`, { headers: authHeaders });
  expect(healthRes.ok()).toBeTruthy();
  const health = await healthRes.json();
  expect(health.status.toLowerCase()).toBe('active');
  expect(health.viewers).toBeGreaterThan(10);

  // 4. Stop the streaming
  const stopStreamRes = await request.post(`/api/streams/${stopStreamID}/stop`, { headers: authHeaders });
  expect(stopStreamRes.ok()).toBeTruthy();
  const stopped = await stopStreamRes.json();
  expect(stopped.status.toLowerCase()).toBe('ended');
  expect(stopped.isLive).toBe(false);

  // 5. Confirm the stream has status updated to ended
  const getStreamRes = await request.get(`/api/streams/${stopStreamID}`, { headers: authHeaders });
  expect(getStreamRes.ok()).toBeTruthy();
  const streamAfterStop = await getStreamRes.json();
  expect(streamAfterStop.status.toLowerCase()).toBe('ended');
  expect(streamAfterStop.isLive).toBe(false);

  // 6. Check the health endpoint again after stopping
  const healthAfterStopRes = await request.get(`/api/streams/${stopStreamID}/health`, { headers: authHeaders });
  expect(healthAfterStopRes.ok()).toBeTruthy();
  const healthAfterStop = await healthAfterStopRes.json();
  expect(healthAfterStop.status.toLowerCase()).toBe('stopped');
  if (healthAfterStop.viewers > 0) {
    throw new Error(`There are still active viewers (${healthAfterStop.viewers}) after stopping the stream!`);
  }
  expect(healthAfterStop.viewers).toBe(0);
});

