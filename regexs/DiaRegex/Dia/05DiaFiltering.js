import { DiaRegex5V3 } from "../RegexData.js";

// 2-12T-150 (dia before symbol, with spacing)
const singleLabelRegex = DiaRegex5V3;

export function extractDiaRegex5(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match && match[2]) {
      allMatches.push([...match]);
    }
  }

  return allMatches;
}
