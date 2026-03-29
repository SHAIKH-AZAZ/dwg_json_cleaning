// 05
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Allow __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Path to your JSON file
const inputPath = path.join(__dirname, "../cleaned_texts.json");
const outputPath = path.join(__dirname, "01output.json");

// ✅ Regex for labels (word boundary + global search)
const singleLabelRegex = /^\s*(\d+)\s*(?:[xX*])\s*(\d+)\s*$/i;

/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
function extractLabelsFromArray(arr) {
  const allMatches = [];
  const regex = /^\s*(\d+)\s*(?:[xX*])\s*(\d+)\s*$/i;

  for (const str of arr) {
    const match = str.match(regex);
    if (match) {
      allMatches.push(match);
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
fs.writeFileSync(outputPath, JSON.stringify(result.sort(), null, 2));

console.log(`✅ Done! Extracted labels saved to: ${outputPath}`);
