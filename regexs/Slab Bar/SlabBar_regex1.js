// extract_regex1.js - Symbol BEFORE Diameter format
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Allow __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Path to your JSON file
const inputPath = path.join(__dirname, "../cleaned_texts.json");
const outputPath = path.join(__dirname, "SlabBar_regex1.json");

// ✅ REGEX 1: Symbol BEFORE diameter
// Matches: "T8", "A - T8@200c/c", "T10 @ 300 c/c", "Y8 @ 125 c/c"
const singleLabelRegex = /^\s*(?:([A-Z]{1,2})\s*[-]?\s*)?(TOR|[YTOØ#])\s*([6-9]|[1-3][0-9]|40)(?:\s*@\s*(\d+)\s*(?:c\/c|C\/C|["\']?\s*c\/c["\']?|["\']?\s*C\/C["\']?))?\s*$/i;

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
      // console.log(match);
      allMatches.push(match);
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

console.log(`✅ Regex1: Extracted ${result.length} labels saved to: ${outputPath}`);
