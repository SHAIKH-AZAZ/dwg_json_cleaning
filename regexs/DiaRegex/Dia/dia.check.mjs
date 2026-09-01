// Smoke check for the bbs-ported dia regexes. Run: node regexs/DiaRegex/Dia/dia.check.mjs
import assert from "node:assert/strict";

import { extractDiaRegex1 } from "./01DiaFiltering.js";
import { extractDiaRegex2 } from "./02DiaFiltering.js";
import { extractDiaRegex3 } from "./03DiaFiltering.js";
import { extractDiaRegex4 } from "./04DiaFiltering.js";
import { extractDiaRegex5 } from "./05DiaFiltering.js";
import { extractDiaRegex6 } from "./06DiaFiltering.js";
import { extractDiaRegex7 } from "./07DiaFiltering.js";
import { extractDiaRegex8 } from "./08DiaFiltering.js";
import { extractDiaRegex9 } from "./09DiaFiltering.js";
import { extractDiaRegex10 } from "./10DiaFiltering.js";
import { extractInchSpacingDia01 } from "./SPACING_INCH_WITH_DIA/01DiaFiltering.js";
import { extractInchSpacingDia02 } from "./SPACING_INCH_WITH_DIA/02DiaFiltering.js";

const hits = (fn, s) => fn([s]).length;

// each extractor matches its own form
assert.equal(hits(extractDiaRegex1, "10-12TOR"), 1);
assert.equal(hits(extractDiaRegex1, "15Ø"), 1);
assert.equal(hits(extractDiaRegex2, "2-T20"), 1);
assert.equal(hits(extractDiaRegex3, "8T20(TOP)"), 1);
assert.equal(hits(extractDiaRegex4, "T12@150C/C"), 1);
assert.equal(hits(extractDiaRegex5, "2-12T-150"), 1);
assert.equal(hits(extractDiaRegex6, "2L-T8-150"), 1);
assert.equal(hits(extractDiaRegex7, "T12-100 mm C/C"), 1);
assert.equal(hits(extractDiaRegex8, "2L-Y10 AT 100C/C"), 1);
assert.equal(hits(extractDiaRegex10, "T16-2L@150C/C(TOP)"), 1);
assert.equal(hits(extractInchSpacingDia01, "2L-Y10@8 IN C/C"), 1);
assert.equal(hits(extractInchSpacingDia02, "12T-6 IN C/C"), 1);

// regex2 now matches inside a larger string (bbs behaviour, was anchored before)
assert.equal(hits(extractDiaRegex2, "BEAM 2-T20 TOP"), 1);

// mixed labels split into one row per term, in either token order
assert.deepEqual(extractDiaRegex9(["2-T20+1-T16(ALL)"]), [
  ["2-T20+1-T16(ALL)", "2-T20", "2", "T", "20", "ALL"],
  ["2-T20+1-T16(ALL)", "1-T16", "1", "T", "16", "ALL"],
]);
assert.deepEqual(extractDiaRegex9(["3-32T+2-25T TH."]), [
  ["3-32T+2-25T TH.", "3-T32", "3", "T", "32"],
  ["3-32T+2-25T TH.", "2-T25", "2", "T", "25"],
]);

console.log("✅ dia regex checks passed");
