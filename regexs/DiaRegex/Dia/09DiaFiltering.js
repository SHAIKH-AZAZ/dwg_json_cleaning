// Mixed dia combinations like:
// 2-T20+1-T16
// 2-T20+1-T16(ALL)
// (3-T25+2-T20) (ALL)
const singleLabelRegex =
  /^\s*\(?\s*(\d+)\s*-\s*([TØY]|TOR)\s*(\d+)\s*\+\s*(\d+)\s*-\s*([TØY]|TOR)\s*(\d+)\s*\)?\s*(?:\(([^)]+)\))?\s*$/i;

export function extractDiaRegex9(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match) {
      allMatches.push([...match]);
    }
  }

  return allMatches;
}
