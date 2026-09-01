import { DiaRegex2V2 } from "../RegexData.js";

// Count-dia labels like 2-T20 or 3T16, matched anywhere in the string.
const singleLabelRegex = DiaRegex2V2;

/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractDiaRegex2(arr) {
  let allMatches = [];

  for (const str of arr) {
    const m = str.match(singleLabelRegex);
    if (m && m[3]) {
      allMatches.push([...m]);
    }
  }

  return allMatches;
}
