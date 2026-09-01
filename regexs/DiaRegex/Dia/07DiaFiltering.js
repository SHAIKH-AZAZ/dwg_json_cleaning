import { DiaRegex7V3 } from "../RegexData.js";

// T12-100 mm C/C ... (C/C mandatory, trailing text allowed)
const singleLabelRegex = DiaRegex7V3;

export function extractDiaRegex7(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match && match[3]) {
      allMatches.push([...match]);
    }
  }

  return allMatches;
}
