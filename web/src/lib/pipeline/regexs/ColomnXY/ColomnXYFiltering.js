
// ✅ Regex for labels (word boundary + global search)
const singleLabelRegex = /^\s*(\d+)\s*(?:[xX*])\s*(\d+)\s*$/i;

/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractColomnXY(arr) {
  const allMatches = [];
  const regex = /^\s*(\d+)\s*(?:[xX*])\s*(\d+)\s*$/i;

  for (const str of arr) {
    const match = str.match(regex);
    if (match) {
      allMatches.push(match);
    }
  }

  return allMatches;
}


