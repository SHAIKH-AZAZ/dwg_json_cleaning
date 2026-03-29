// 05 
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input / Output
const inputPath = path.join(__dirname, "../../cleaned_texts.json");
const outputPath = path.join(__dirname, "BarDiaCombineRegex.json");


let count = 0;
// -------------------------------
//  REGEX DEFINITIONS
// -------------------------------

// ❶ 10-12T  or  15Ø
const BarDiaRegex1 =
  /^(?:(\d+)\s*-\s*(\d+)\s*([YTØ#]|TOR)|(\d+)\s*([YTØ#]|TOR))$/i;

// ❷ Same as above (kept separate if needed later)
const BarDiaRegex2 =
  /^(?:(\d+)\s*-\s*(\d+)\s*([YTØ#]|TOR)|(\d+)\s*([YTØ#]|TOR))$/i;

// ❸ 8T20(TOP) or 12Ø16(BOTTOM)
const BarDiaRegex3 =
  /^(\d+)\s*-?\s*([TØY]|TOR)\s*(\d+)(?:\(([^)]+)\))?(?:([A-Z]+))?$/i;

// ❹ T12@150C/C , T12-100C/C
const BarDiaRegex4 = 
  /^([TØY]|TOR)\s*(\d+)\s*([-@]\s*\d+(?:\+\d+)*)\s*(?:C\/C)?/i;

// ❺ 2-12T-150 (special spacing cases)
const BarDiaRegex5 =
  /^(?:(\d+)-)?(\d+)(TOR|T|Y|Φ)(?:[-@])(\d+)((?:\+\d+)*)(?:\s*C\/C)?$/i;

// ❻ 2L-T8-150
const BarDiaRegex6 =
  /^\s*(\d+L)\s*-\s*([TØY]|TOR)\s*(\d+)\s*-\s*(\d+)\s*$/i;


// Put ALL patterns in one list
const ALL_PATTERNS = [
  BarDiaRegex1,
  BarDiaRegex2,
  BarDiaRegex3,
  BarDiaRegex4,
  BarDiaRegex5,
  BarDiaRegex6
];

// -------------------------------
//  NORMALIZER (Unified Output)
// -------------------------------
//
// Output Format ALWAYS:
//
// [
//   fullMatch,
//   prefix (or undefined),
//   symbol,
//   dia,
//   spacing (or undefined)
// ]
//

function normalize(patternIndex, m) {
  if (!m) return null;

  switch (patternIndex) {

    // ----------------
    // BarDiaRegex1 / BarDiaRegex2
    // ----------------
    case 0:
    case 1:
      if (m[1]) {
        return [m[0], m[1] + "-" + m[2], m[3], m[2], undefined];
      }
      if (m[4]) {
        return [m[0], undefined, m[5], m[4], undefined];
      }
      return null;

    // ----------------
    // BarDiaRegex3: 8T20(TOP)
    // ----------------
    case 2:
      return [
        m[0],
        undefined,
        m[2],
        m[1],
        m[3]  // top/bottom
      ];

    // ----------------
    // BarDiaRegex4: T12@150C/C
    // ----------------
    case 3:
      return [
        m[0],
        undefined,
        m[1],
        m[2],
        m[3].replace(/[@-]/g, "")   // only number
      ];

    // ----------------
    // BarDiaRegex5: 2-12T-150
    // ----------------
    case 4:
      return [
        m[0],
        m[1] || undefined,
        m[3],
        m[2],
        m[4]
      ];

    // ----------------
    // BarDiaRegex6: 2L-T8-150
    // ----------------
    case 5:
      return [
        m[0],
        m[1],  // prefix 2L
        m[2],
        m[3],
        m[4]
      ];

    default:
      return null;
  }
}

// -------------------------------
//  RUN MATCHES
// -------------------------------
function extractLabelsFromArray(arr) {
  let out = [];

  for (const str of arr) {
    for (let i = 0; i < ALL_PATTERNS.length; i++) {
      const m = str.match(ALL_PATTERNS[i]);
      count++;
      if (m) {
        const normalized = normalize(i, m);
        if (normalized) out.push(normalized);
        break; // stop at first matched regex
      }
    }
  }
  return out;
}

// -------------------------------
//  EXECUTE
// -------------------------------
const raw = fs.readFileSync(inputPath, "utf-8");
const jsonArray = JSON.parse(raw);

const result = extractLabelsFromArray(jsonArray);

// REMOVE DUPLICATES
const unique = [...new Set(result.map(r => JSON.stringify(r)))]
  .map(v => JSON.parse(v));

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`✅ Extracted ${unique.length} bar dia labels -> ${outputPath}`);
