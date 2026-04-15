// Mixed dia combinations like:
// 2-T20+1-T16
// 2-T20+1-T16(ALL)
// (3-T25+2-T20) (ALL)
const mixedLabelRegex =
  /^\s*\(?\s*(\d+)\s*-\s*([YTØ#]|TOR)\s*(\d+)\s*\+\s*(\d+)\s*-\s*([YTØ#]|TOR)\s*(\d+)\s*\)?\s*(?:\(([^)]+)\))?\s*$/i;

export function extractDiaRegex9(arr) {
  const allMatches = [];
  const makeRow = (original, count, symbol, dia, suffix) => [
    original,
    `${count}-${symbol.toUpperCase()}${dia}`,
    count,
    symbol.toUpperCase(),
    dia,
    ...(suffix ? [suffix] : []),
  ];

  for (const str of arr) {
    const match = str.match(mixedLabelRegex);
    if (!match) continue;

    const [, count1, symbol1, dia1, count2, symbol2, dia2, note] = match;
    const original = str.trim();
    const suffix = note?.trim();

    allMatches.push(
      makeRow(original, count1, symbol1, dia1, suffix),
      makeRow(original, count2, symbol2, dia2, suffix)
    );
  }

  return allMatches;
}
