// Main entry point for test data module

const authTokenData = require('./test-data/auth_token_data.json');
const contentStatuses = require('./test-data/content_statuses.json');
const randomDataContentTitle = require('./test-data/random_data_content_title.json');

// JS helpers
const streamEndTimeCalc = require('./test-data/stream_endTime_calc');
const streamingTimesCalc = require('./test-data/streaming_times_calc');

module.exports = {
  authTokenData,
  contentStatuses,
  randomDataContentTitle,
  streamEndTimeCalc,
  streamingTimesCalc,
};
