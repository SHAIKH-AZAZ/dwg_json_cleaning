
const singleLabelRegex =
  /^\s*(?:([YTOØ]|TOR)\s*)?(\d+)\s*(?:[YTOØ]|TOR)?\s*[@-]\s*(\d+)\s*(?:C\/C)?\s*$/iu;

/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractFootingBar(arr) {
  let allMatches = [];

  for (const str of arr) {
    let match;

    match = str.match(singleLabelRegex)
    if (!(match == null)) {
      // console.log(match);
      allMatches.push(match);

    }

    singleLabelRegex.lastIndex = 0; // reset regex
  }

  return allMatches;
}

