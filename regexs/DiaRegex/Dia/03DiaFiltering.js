// ✅ Regex for labels (word boundary + global search)
const singleLabelRegex =
  /^(\d+)\s*-?\s*([TØY])\s*(\d+)(?:\(([^)]+)\))?(?:([A-Z]+))?$/;


/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractDiaRegex3(arr) {
  let allMatches = [];

  for (const str of arr) {
    const m = str.match(singleLabelRegex);
    if (m !== null) {
      // console.log(m);
      allMatches.push(m);
    }

    
    
    singleLabelRegex.lastIndex = 0; // reset regex
  }

  return allMatches;
}

