
let count = 0;

// ✅ Regex for labels (word boundary + global search)
const singleLabelRegex = /\b(\d+)\s*[-±,]?\s*([YTØ#]|TOR)\s*(\d+)\b/;
/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractDiaRegex2(arr) {
  let allMatches = [];

  for (const str of arr) {
    const m = str.match(singleLabelRegex);
    if (!(m == null)) {
      // console.log(m);
      count++;
      allMatches.push([...m]);
    }

    singleLabelRegex.lastIndex = 0; // reset regex
  }

  return allMatches;
}

