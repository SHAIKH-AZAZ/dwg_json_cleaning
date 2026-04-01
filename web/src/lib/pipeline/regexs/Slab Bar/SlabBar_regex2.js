// extract_regex2.js - Diameter BEFORE Symbol format
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Allow __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Path to your JSON file
const inputPath = path.join(__dirname, "../cleaned_texts.json");
const outputPath = path.join(__dirname, "SlabBar_regex2.json");

// ✅ REGEX 2: Diameter BEFORE symbol
// Matches: "10T@300 c/c", "10 T - 12" c/c", "10 TOR @ 125 c/c"
const singleLabelRegex = /^\s*([6-9]|[1-3][0-9]|40)\s*(TOR|[YTOØ])\s*[@-]?\s*(\d+)\s*(?:c\/c|C\/C|["\']?\s*c\/c["\']?|["\']?\s*C\/C["\']?)\s*$/i;

/**
 * Normalize match to format: [fullMatch, slabType, symbol, diameter, spacing]
 */
function normalizeMatch(match) {
  if (!match) return null;

  return [
    match[0],      // full match
    undefined,     // no slabType
    match[2],      // symbol
    match[1],      // diameter
    match[3]       // spacing
  ];
}

/**
 * Extracts labels from an array of strings
 * @param {string[]} arr - Array of input strings
 * @returns {Array[]} all matches
 */
function extractLabelsFromArray(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match) {
      const normalized = normalizeMatch(match);
      // console.log(normalized);
      allMatches.push(normalized);
    }
  }

  return allMatches;
}

// ✅ Load JSON
const raw = fs.readFileSync(inputPath, "utf-8");
const jsonArray = JSON.parse(raw);

// ✅ Extract all matches
const result = extractLabelsFromArray(jsonArray);

// ✅ Save filtered result
fs.writeFileSync(outputPath, JSON.stringify(result.sort(), null, 2));

console.log(`✅ Regex2: Extracted ${result.length} labels saved to: ${outputPath}`);
