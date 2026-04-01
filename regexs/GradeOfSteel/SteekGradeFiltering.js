
// Regex to match Fe + number (ignore any extra letters or spaces)
const singleLabelRegex = /\bFe\s*:?\s*(\d+)\b:*/i;

/**
 * Extracts labels from an array of strings
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches cleaned
 */
export function extractSteekOfGrade(arr) {
  const allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match) {
      // console.log(match);

      // Combine "Fe" + number only, ignore spaces/extra letters
      const label = `Fe${match[1]}`;
      allMatches.push(label);
    }
  }

  return Array.from(new Set(allMatches)).sort();
}

