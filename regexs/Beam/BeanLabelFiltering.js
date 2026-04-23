// 05

const singleLabelRegex =
  /(?<![A-Za-z0-9_-])(HB\d*[A-Za-z]?|RR\d*[A-Za-z]?|B\d+[A-Za-z]?|P\d+[A-Za-z]?|RB\d+[A-Za-z]?|PTBB\d+[A-Za-z]?|PB\d+[A-Za-z]?|SB\d+[A-Za-z]?|SBT\d+[A-Za-z]?|MB\d+[A-Za-z]?|AB\d+[A-Za-z]?|BB\d+[A-Za-z]?|CB\d+[A-Za-z]?|FFB\d+[A-Za-z]?|TFB\d+[A-Za-z]?|LB\d+[A-Za-z]?|LBK\d+[A-Za-z]?|DB\d+[A-Za-z]?|TB\d+[A-Za-z]?|bs\d+[A-Za-z]?|\d+F_B\d+[A-Za-z]?|MF_B\d+[A-Za-z]?|LGF_B\d+[A-Za-z]?|UGF_B\d+[A-Za-z]?|SGF_B\d+[A-Za-z]?|STB_B\d+[A-Za-z]?|LPTB-\d+[A-Za-z]?)(?![A-Za-z0-9_])/gi;

/**
 * Extracts labels from an array of strings and flattens into a single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
export function extractBeamLabels(arr) {
  const allMatches = [];
  let count = 0
  for (const str of arr) {
    const matches = str.matchAll(singleLabelRegex);

    for (const m of matches) {
      count++;
      allMatches.push(m[0]);
    }
  }

  return allMatches ;
}