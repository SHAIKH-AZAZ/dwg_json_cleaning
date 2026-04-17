
// Match Fe + number + optional letter (like D)
const singleLabelRegex = /\bFe\s*(\d+)([A-Za-z]?)\b/i;


/**
 * Extracts labels from an array of strings
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches cleaned
 */
export function extractSteelOfGrade(arr) {
  const allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match) {
      // Combine Fe + number + optional letter
      allMatches.push(match);
    }
  }

  return Array.from(new Set(allMatches)).sort();
}