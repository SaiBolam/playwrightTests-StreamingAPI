// This is a helper file to prepare the test data for generating the start and end times for various request bodies

const { faker } = require('@faker-js/faker');

function getStreamTimes() {
  const now = new Date();
  const startTimeObj = new Date(now.getTime() - 60 * 60 * 1000); // current time - 1 hour
  const startTime = startTimeObj.toISOString();
  const endTime = new Date(startTimeObj.getTime() + 2 * 60 * 60 * 1000).toISOString(); // startTime + 2 hours
  return { startTime, endTime };
}

module.exports = { getStreamTimes };