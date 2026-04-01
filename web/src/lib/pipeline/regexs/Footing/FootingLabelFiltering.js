
const singleLabelRegex =
  /\b(?:F\d+[A-Za-z]*|BF\d+[A-Za-z]*|AF\d+[A-Za-z]*|CF\d+[A-Za-z]*|NF\d+[A-Za-z]*|BRF\d+[A-Za-z]*|Raft-\d+[A-Za-z]*|R\d+[A-Za-z]*|RW\d*[A-Za-z]|CP\d+[A-Za-z]*|AC\d+[A-Za-z]*|FC\d+[A-Za-z]*|FP\d+[A-Za-z]*|ARF\d+[A-Za-z]*|CWF\d+[A-Za-z]*|LPW\d+[A-Za-z])\b/gi;
  // this regex is for seperating prefix and suffix

const seperationRegex = /^([A-Za-z-]+)(\d+[A-Za-z]*)?$/;
  // const singleLabelRegex = /^\s*(C|F|BF|CP|CF|RW|AC|GC|BC|NC|SW)(\d*[A-Za-z]*)\s*$/;
  // const singleLabelRegex =
  // /^\s*(C|F|BF|CP|CF|RW|AF|BRF|BC|NC|SW|AC|RW)(\d+[A-Za-z]*)\s*$/i;

/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractFooting(arr) {
  let allMatches = [];
  let count = 0;

  for (const str of arr) {
  const Match = str.match(singleLabelRegex);  // returns array or null
  // console.log(Match);

  if (Match !== null) {
    for (let Smatch of Match) {
      const parts = Smatch.match(seperationRegex);
      if (parts !== null) { 
        allMatches.push(parts);
      }
    }
  }
}

  return allMatches;
}

