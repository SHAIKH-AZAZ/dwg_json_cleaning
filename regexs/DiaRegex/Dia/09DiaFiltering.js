import { DiaMixedLabelRegex } from "../RegexData.js";

// Mixed dia combinations like:
// 2-T20+1-T16
// 2-T20+1-T16(ALL)
// (3-T25+2-T20) (ALL)
// 3-32T+2-25T TH.        (dia before symbol, bare trailing note)
const mixedLabelRegex = DiaMixedLabelRegex;

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

    const [ 
      , count1, diaFirst1, symbolFirst1, symbolLast1, diaLast1,
      count2, diaFirst2, symbolFirst2, symbolLast2, diaLast2, note,
    ] = match;

    // Each term matched one of two alternatives - dia-then-symbol ("32T") or
    // symbol-then-dia ("T32") - so exactly one pair of that term's two capture
    // groups is populated; take whichever one is not undefined.
    const dia1 = diaFirst1 ?? diaLast1;
    const symbol1 = symbolFirst1 ?? symbolLast1;
    const dia2 = diaFirst2 ?? diaLast2;
    const symbol2 = symbolFirst2 ?? symbolLast2;

    const original = str.trim();
    const suffix = note?.trim();

    allMatches.push(
      makeRow(original, count1, symbol1, dia1, suffix),
      makeRow(original, count2, symbol2, dia2, suffix)
    );
  }

  return allMatches;
}
