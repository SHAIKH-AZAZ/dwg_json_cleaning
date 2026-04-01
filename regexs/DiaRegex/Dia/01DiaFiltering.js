
// ✅ Regex that handles both cases: "10-12TOR" and "15Ø"
const singleLabelRegex =
  /^(?:(\d+)\s*-\s*(\d+)\s*([YTØ#]|TOR)|(\d+)\s*([YTØ#]|TOR))$/;

/**
 *  4T "4th bar timgs"
 * Normalize regex result into [ full, bar, dia, symbol ]
 */
function normalizeMatch(m) {
  if (!m) return null;
  // console.log(m);
  
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
    const m = str.match(singleLabelRegex);
    const normalized = normalizeMatch(m);
    if (normalized) {
      // console.log(normalized);
      allMatches.push(normalized);
    }
  }

  return allMatches;
}

