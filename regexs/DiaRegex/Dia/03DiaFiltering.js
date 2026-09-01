import { DiaRegex3V2 } from "../RegexData.js";

// 8T20(TOP) style labels
const singleLabelRegex = DiaRegex3V2;

/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractDiaRegex3(arr) {
  let allMatches = [];

  for (const str of arr) {
    const m = str.match(singleLabelRegex);
    if (m && m[3]) {
      allMatches.push([...m]);
    }
  }

  return allMatches;
}
