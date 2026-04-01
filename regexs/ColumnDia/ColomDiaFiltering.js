
// Regex for column labels
// const singleLabelRegex = /^\s*(\d+)\s*(D|Ø)\s*$/gi;
const singleLabelRegex = /^\s*(\d+)\s*(D|Ø)\s*$/gi;
/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractColomnDia(arr) {
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

