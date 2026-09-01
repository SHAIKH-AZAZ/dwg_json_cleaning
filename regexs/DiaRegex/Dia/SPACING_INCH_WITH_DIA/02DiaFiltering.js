import { DiaInchRegex2V1 } from "../../RegexData.js";

// 12T-6 IN C/C , 2L-16Y@8 IN C/C (dia before symbol)
const singleLabelRegex = DiaInchRegex2V1;

export function extractInchSpacingDia02(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match && match[2]) {
      allMatches.push([...match]);
    }
  }

  return allMatches;
}
