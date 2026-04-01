
// ✅ Regex for labels (word boundary + global search)
const singleLabelRegex = /\bM-?\d+\b/g;


/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */

export function extractGradeOfConcrete(arr) {
  let allMatches = [];

  for (const str of arr) {
    let match;

    while ((match = singleLabelRegex.exec(str)) !== null) {
      // console.log(match[0]);       // "M35"
      allMatches.push(match[0]);  // push only the matched text
    }

    singleLabelRegex.lastIndex = 0; // reset for next string
  }

  return allMatches;
}

