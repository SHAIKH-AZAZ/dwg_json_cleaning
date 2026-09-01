import { DiaRegex4V4 } from "../RegexData.js";

// T12@150C/C , 2-T12-100+150
const singleLabelRegex = DiaRegex4V4;

export function extractDiaRegex4(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match && match[3]) {
      allMatches.push([...match]);
    }
  }

  return allMatches;
}
