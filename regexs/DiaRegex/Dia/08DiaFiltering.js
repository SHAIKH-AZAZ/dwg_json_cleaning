import { DiaRegex8V1 } from "../RegexData.js";

// Supports:
// Y8 AT 200C/C
// 2L-Y10 AT 100C/C
// 2L-Y10 AT 100 C/C+
const singleLabelRegex = DiaRegex8V1;

export function extractDiaRegex8(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match && match[3]) {
      allMatches.push([...match]);
    }
  }

  return allMatches;
}
