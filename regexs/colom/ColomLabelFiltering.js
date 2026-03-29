import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Allow __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Path to your JSON file
const inputPath = path.join(__dirname, "../cleaned_texts.json");
const outputPath = path.join(__dirname, "ColumnLabels.json");
let count = 0;

// Regex for column labels
const singleLabelRegex =
  /\b(?:[A-Z]{1,3}-)?(?:ASW|BSW|SW|LW|AC|GC|BC|CP|NC|SC|PC|RW|TW|TA-C|TB-C|TC-C|P|C|R|W)-?\d+(?:[A-Z]+)?(?:-\d+)?\b/gi;
  // note that , this regex will return  array of string ....

// const singleLabelRegex = /^\s*(C|AC|GC|BC|CP|NC|SW)\d+[A-Z]*\s*$/i;
// this regex is for c1 to c2 like strings
// const singleLabelRegex = /\b(?:[A-Z]{1,3}-)?(?:BSW|SW|LW|AC|GC|BC|CP|NC|SC|PC|RW|P|C|R)-?\d+[A-Z]*(?:\s*(?:-|to)\s*\d+[A-Z]*)?\b/gi;
// original regex const singleLabelRegex = /^\s*(C|AC|GC|BC|CP|NC|SW)\d+[A-Z]*\s*$/i;

/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
function extractLabelsFromArray(arr) {
  let allMatches = [];

  for (const str of arr) {
    let match;

    match = str.match(singleLabelRegex);
    if (!(match == null)) {
      console.log(match);
      allMatches.push(...match);
      count++;
    }
    singleLabelRegex.lastIndex = 0; // reset regex
  }

  return allMatches;
}

// ✅ Load JSON
const raw = fs.readFileSync(inputPath, "utf-8");
const jsonArray = JSON.parse(raw);

// ✅ Extract all matches into one array
const result = extractLabelsFromArray(jsonArray);

// ✅ Save filtered result
// const filteredResult = new Set(...result)
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`✅ Done! Extracted labels saved to: ${outputPath}`);
console.log(`Total Matches : ${count}`);
