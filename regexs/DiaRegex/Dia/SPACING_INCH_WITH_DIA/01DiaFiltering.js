
const singleLabelRegex =
  /^\s*(?:(\d+L)-)?([TØY]|TOR)\s*(\d+)\s*[@-]\s*(\d+)\s*IN\s*(?:C\/C\b.*)?$/i;


export function extractInchSpacingDia01(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex)
    if (match) {
      count++;
      allMatches.push([...match]);
    }
  }

  return allMatches;
}

