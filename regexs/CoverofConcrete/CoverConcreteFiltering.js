
// ✅ Regex for labels (word boundary + global search)
const singleLabelRegex = /\bcover\s*(?:=\s*)?(\d+)\s*mm\b/i;

/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */

export function extractCoverOfConcrete(arr) {
  let allMatches = [];

  for (const str of arr) {
    let match;

    match = str.match(singleLabelRegex);
    if (!(match == null)) {

      allMatches.push(match);
    }

    singleLabelRegex.lastIndex = 0; // reset regex
  }

  return allMatches;
}

