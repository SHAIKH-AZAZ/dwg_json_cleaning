/* This regular expression `const singleLabelRegex =
/^(?:(\d+)-)?(\d+)(TOR|T|Y|Φ)\s*(?:@|-)?\s*(\d+)\s*IN\s*(?:C\/C)?$/i;` is used to match and extract
specific patterns from strings. Here is a breakdown of what each part of the regex does: */
const singleLabelRegex =
  /^(?:(\d+(?:L)?)-)?(\d+)(TOR|T|Y|Φ)\s*(?:@|-)?\s*(\d+)\s*IN\s*(?:C\/C\b.*)?$/i;

let count = 0;

export function extractInchSpacingDia02(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex)
    if (match) {
      count++;
      allMatches.push([...match]);
    }
  }

  return allMatches;
}

