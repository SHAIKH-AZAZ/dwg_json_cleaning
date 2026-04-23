
// Regex for column labels
const singleLabelRegex =
  /\b(?:[A-Z]{1,3}-)?(?:ASW|BSW|SW|LW|AC|GC|BC|CP|NC|SC|PC|RW|TW|TA-C|TB-C|TC-C|P|C|R|W|PX)-?\d+(?:[A-Z]+)?(?:-\d+)?\b/gi;
  // note that , this regex will return  array of string ....

/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractColumLabels(arr) {
  let allMatches = [];
  let count = 0;

  for (const str of arr) {
    let match;

    match = str.match(singleLabelRegex);
    if (!(match == null)) {
      // console.log(match);
      allMatches.push(...match);
      count++;
    }
    singleLabelRegex.lastIndex = 0; // reset regex
  }

  return allMatches;
}

