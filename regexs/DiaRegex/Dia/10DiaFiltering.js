import { DiaRegex9V1 } from "../RegexData.js";

// T16-2L@150C/C(TOP)
const singleLabelRegex = DiaRegex9V1;

export function extractDiaRegex10(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match && match[2]) {
      allMatches.push([...match]);
    }
  }

  return allMatches;
}
