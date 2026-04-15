
// ✅ Regex for labels (word boundary + global search)
const singleLabelRegex =
  /^(.*?)\b(Y|T|Ø|TOR)\s*(\d+)?\s*((?:\s*(?:\+\s*)?\d*\s*[-@]\s*\d+)+)\s*(?:C\/C)?$/;

 // added "-" and "@" support for extraction 
// /^(.*?)\b(Y|T|Ø|TOR)\s*(\d+)?\s*((?:\s*(?:\+\s*)?\d*\s*@\s*\d+)+)\s*(?:C\/C)?$/i
  // 2L - T8-300   , 5    
/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractSpacingLabelFiltering(arr) {
  let allMatches = [];
  let count = 0;

  for (const str of arr) {
    let match;

    match = str.match(singleLabelRegex);
    if (!(match == null)) {
      count++;
      // console.log(match.filter(v => v !== null && v !== undefined));
      // allMatches.push(match.filter(v => v !== null && v !== undefined));
      // console.log(match);ḥ
      allMatches.push(match);
    }

    singleLabelRegex.lastIndex = 0; // reset regex
  }

  return allMatches;
}

