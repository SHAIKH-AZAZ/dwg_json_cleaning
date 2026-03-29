// 05 - Extract Slab Bar Labels (Updated for Real Schedule Formats)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Allow __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Path to your JSON file
const inputPath = path.join(__dirname, "../cleaned_texts.json");
const outputPath = path.join(__dirname, "SlabBar_regex_marge.json");

// ✅ REGEX 1: Symbol BEFORE diameter (standard format)
// Matches: "T8", "A - T8@200c/c", "T10 @ 300 c/c"
const regex1 = /^\s*(?:([A-Z]{1,2})\s*[-]?\s*)?(TOR|[YTOØ#])\s*([6-9]|[1-3][0-9]|40)(?:\s*@\s*(\d+)\s*(?:c\/c|C\/C|["\']?\s*c\/c["\']?|["\']?\s*C\/C["\']?))?\s*$/i;

// ✅ REGEX 2: Diameter BEFORE symbol (alternate format)
// Matches: "10T@300 c/c", "10 T - 12" c/c", "10 TOR @ 125 c/c"
const regex2 = /^\s*([6-9]|[1-3][0-9]|40)\s*(TOR|[YTOØ])\s*[@-]?\s*(\d+)\s*(?:c\/c|C\/C|["\']?\s*c\/c["\']?|["\']?\s*C\/C["\']?)\s*$/i;

// ✅ REGEX 3: Diameter before symbol with spacing-only format
// Matches: "8@200" c/c" (no symbol)
const regex3 = /^\s*([6-9]|[1-3][0-9]|40)\s*@\s*(\d+)\s*(?:c\/c|C\/C|["\']?\s*c\/c["\']?|["\']?\s*C\/C["\']?)\s*$/i;

/**
 * Normalize match to consistent format: [fullMatch, slabType, symbol, diameter, spacing]
 */
function normalizeMatch(match, type) {
  if (!match) return null;
  
  if (type === 'regex1') {
    // Groups: slabType, symbol, diameter, spacing
    return [
      match[0],
      match[1] || undefined,
      match[2] || undefined,
      match[3],
      match[4] || undefined
    ];
  } else if (type === 'regex2') {
    // Groups: diameter, symbol, spacing
    return [
      match[0],
      undefined,  // no slabType
      match[2],   // symbol
      match[1],   // diameter
      match[3]    // spacing
    ];
  } else if (type === 'regex3') {
    // Groups: diameter, spacing (no symbol)
    return [
      match[0],
      undefined,  // no slabType
      undefined,  // no symbol
      match[1],   // diameter
      match[2]    // spacing
    ];
  }
  
  return null;
}

/**
 * Extracts labels from an array of strings
 * @param {string[]} arr - Array of input strings
 * @returns {Array[]} all matches
 */
function extractLabelsFromArray(arr) {
  let allMatches = [];

  for (const str of arr) {
    let match = null;
    let normalized = null;

    // Try regex1: Symbol before diameter
    match = str.match(regex1);
    if (match) {
      normalized = normalizeMatch(match, 'regex1');
      if (normalized) {
        console.log(normalized);
        allMatches.push(normalized);
        continue;
      }
    }

    // Try regex2: Diameter before symbol
    match = str.match(regex2);
    if (match) {
      normalized = normalizeMatch(match, 'regex2');
      if (normalized) {
        console.log(normalized);
        allMatches.push(normalized);
        continue;
      }
    }

    // Try regex3: Diameter @ spacing only
    match = str.match(regex3);
    if (match) {
      normalized = normalizeMatch(match, 'regex3');
      if (normalized) {
        console.log(normalized);
        allMatches.push(normalized);
      }
    }
  }

  return allMatches;
}

// ✅ Load JSON
const raw = fs.readFileSync(inputPath, "utf-8");
const jsonArray = JSON.parse(raw);

// ✅ Extract all matches into one array
const result = extractLabelsFromArray(jsonArray);

// ✅ Save filtered result
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`✅ Done! Extracted ${result.length} labels saved to: ${outputPath}`);
