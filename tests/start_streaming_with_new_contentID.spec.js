// Sceanrio 3 :  As an admin user I must be able to start streaming for new;ly created content with sports genere 
// and validate that the streaming is started sucessfully and verify the content is Live and stautes of the steaming is Active.

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { getStreamTimes } = require('../test-data/streaming_times_calc');

const ADMIN_TOKEN = require ("../test-data/auth_token_data");

test('Start Streaming with the newly created content i.e. sports genre', async ({ request }) => {
  const authHeaders = { Authorization: `Bearer ${ADMIN_TOKEN['user_1']['token']}` };

  // 1. Lets get all  the contents to identfy the latest created content with genre 'Sport'
 const getContentsList = await request.get("/api/content", { headers: authHeaders });

    //console.log(await getContentsList.json());

  expect(getContentsList.ok()).toBeTruthy();
  
  const contentsResponse = await getContentsList.json();
  expect(Array.isArray(contentsResponse)).toBe(true);

  // 2. Find latest created content with genre 'Sport'
  const sportsContents = contentsResponse.filter(c => c.metadata && c.metadata.genre && c.metadata.genre.toLowerCase() === 'sport');
  expect(sportsContents.length).toBeGreaterThan(0);

  // Identify the latest sports genre content with createdAt datetime
  sportsContents.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const latestContent = sportsContents[0];

  const latestContentID = latestContent.id;
  expect(latestContentID).toBeDefined();

  // 3. Create a new stream using latestContentID

  const { startTime, endTime } = getStreamTimes();

  const streamBody = {
    contentId: latestContentID,
    status: 'active',
    isLive: false,
    startTime,
    endTime,
    playbackUrl: 'https://stream.example.com/live/stream-2.m3u8',
    rtmpUrl: 'rtmp://ingest.example.com/live/stream-2',
    streamKey: 'live_0987654321',
    variants: [
      { id: '1080p', bitrate: 6000000, resolution: '1920x1080', codec: 'h264' }
    ]
  };
  
  const createNewStreamRes = await request.post(`/api/streams`, {
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json'
    },
    data: streamBody
  });
  expect(createNewStreamRes.ok()).toBeTruthy();
  const newStream = await createNewStreamRes.json();

  expect(newStream).toHaveProperty('id');
  const streamID = newStream.id;

  // 4. Start the stream
  const startStreamingResp = await request.post(`/api/streams/${streamID}/start`, {
    headers: authHeaders
  });
  expect(startStreamingResp.ok()).toBeTruthy();
  console.log(await startStreamingResp.json());
  
  const startedStreaming = await startStreamingResp.json();

  //below are the new stream start response validations tests 
  expect(startedStreaming.status.toLowerCase()).toBe('active');
  expect(startedStreaming.isLive).toBe(true);
  expect(typeof startedStreaming.playbackUrl).toBe('string');
  expect(startedStreaming.playbackUrl.length).toBeGreaterThan(0);
  expect(typeof startedStreaming.streamKey).toBe('string');
  expect(startedStreaming.streamKey.length).toBeGreaterThan(0);
  expect(Array.isArray(startedStreaming.variants)).toBe(true);
  expect(startedStreaming.variants.length).toBeGreaterThan(0);
  expect(startedStreaming.variants[0]).toMatchObject({ id: '1080p', bitrate: 6000000, resolution: '1920x1080', codec: 'h264' });
  expect(startedStreaming).toHaveProperty('createdAt');
  expect(startedStreaming).toHaveProperty('updatedAt');
  expect(startedStreaming).toHaveProperty('startedAt');

 
});

