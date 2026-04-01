
// ✅ Regex for labels (word boundary + global search)
const singleLabelRegex = /^\s*cover\s*=?\s*(\d+)\s*mm\s*$/;

/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractLegOfStirrup(arr) {
  let allMatches = [];

  for (const str of arr) {
    let match;

    match = str.match(singleLabelRegex);
    if (!(match == null)) {
      // console.log(match);
      allMatches.push(match);
    }

    singleLabelRegex.lastIndex = 0; // reset regex
  }

  return allMatches;
}

