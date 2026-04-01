
const singleLabelRegex =
  /^(?:(\d+-)\s*)?([TØY]|TOR)\s*(\d+)\s*([-@]\s*\d+(?:\+\d+)*\s*)+(?:C\/C)?(?:\s+.*)?$/i;

export function extractDiaRegex4(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex)
    if (match) {
      allMatches.push([...match]);
    }
  }

  return allMatches;
}

