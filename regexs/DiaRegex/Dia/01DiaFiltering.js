import { DiaRegex1V3 } from "../RegexData.js";

// Handles "10-12TOR", "15Ø", and either of those carrying a trailing
// annotation - "4-10T (S.F.R)", "4-10T S.F.R".
const singleLabelRegex = DiaRegex1V3;

/**
 * Normalize regex result into [ label, bar, dia, symbol ]
 *
 * The label is rebuilt from the captures rather than taken from m[0]: the regex
 * now tolerates a trailing annotation, and m[0] would drag it into the label
 * ("4-10T (S.F.R)" instead of "4-10T"), which downstream uses as a dia key.
 */
function normalizeMatch(m) {
  if (!m) return null;

  // Case 1: range (10-12TOR)
  if (m[1]) {
    return [`${m[1]}-${m[2]}${m[3]}`, m[1], m[2], m[3]];
  }
  // Case 2: single (15Ø)
  if (m[4]) {
    return [`${m[4]}${m[5]}`, undefined, m[4], m[5]];
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
