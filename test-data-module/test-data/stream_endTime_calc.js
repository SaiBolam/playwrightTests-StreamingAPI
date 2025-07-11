// this function is used to calculate the end times for a stream and then used in a test case 
// to validate the end time of a live stream is past the current time
function streamEndTimeCalcISOString() {
  return new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
}

module.exports = { streamEndTimeCalcISOString };
