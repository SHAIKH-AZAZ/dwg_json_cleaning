import { DiaRegex1V3 } from "../RegexData.js";

// Handles both "10-12TOR" and "15Ø"
const singleLabelRegex = DiaRegex1V3;

/**
 * Normalize regex result into [ full, bar, dia, symbol ]
 */
function normalizeMatch(m) {
  if (!m) return null;

  // Case 1: range (10-12TOR)
  if (m[1]) {
    return [m[0], m[1], m[2], m[3]];
  }
  // Case 2: single (15Ø)
  if (m[4]) {
    return [m[0], undefined, m[4], m[5]];
  }
  return null;
}

/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractDiaRegex1(arr) {
  let allMatches = [];

  for (const str of arr) {
    const normalized = normalizeMatch(str.match(singleLabelRegex));
    if (normalized) {
      allMatches.push(normalized);
    }
  }

  return allMatches;
}
