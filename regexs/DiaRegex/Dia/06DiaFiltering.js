// bbs's dia-parser binds its regex6 slot to DiaRegex6V3, which is a duplicate of
// DiaRegex4V4 and leaves the 2L-T8-150 form unparsed there. Use bbs's dedicated
// 2L constant (DiaRegex6V2) instead so this slot keeps its own coverage.
import { DiaRegex6V2 } from "../RegexData.js";

// 2L-T8-150
const singleLabelRegex = DiaRegex6V2;

export function extractDiaRegex6(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match) {
      allMatches.push([...match]);
    }
  }

  return allMatches;
}
