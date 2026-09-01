import { DiaInchRegex1V1 } from "../../RegexData.js";

// T12-6 IN C/C , 2L-Y10@8 IN C/C
const singleLabelRegex = DiaInchRegex1V1;

export function extractInchSpacingDia01(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match && match[3]) {
      allMatches.push([...match]);
    }
  }

  return allMatches;
}
