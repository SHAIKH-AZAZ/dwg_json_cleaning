import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Allow __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const inputPath = path.join(__dirname, "../cleaned_texts.json");
const outputPath = path.join(__dirname, "GradeOfSteel.json");

// Regex to match Fe + number (ignore any extra letters or spaces)
const singleLabelRegex = /\bFe\s*:?\s*(\d+)\b:*/i;

/**
 * Extracts labels from an array of strings
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches cleaned
 */
function extractLabelsFromArray(arr) {
  const allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);
    if (match) {
      console.log(match);
      
      // Combine "Fe" + number only, ignore spaces/extra letters
      const label = `Fe${match[1]}`;
      allMatches.push(label);
    }
  }

  return allMatches;
}

// Load JSON
const raw = fs.readFileSync(inputPath, "utf-8");
const jsonArray = JSON.parse(raw);

// Extract and clean labels
const result = extractLabelsFromArray(jsonArray);

// Remove duplicates and sort
const uniqueSortedResult = Array.from(new Set(result)).sort();

// Save filtered result
fs.writeFileSync(outputPath, JSON.stringify(uniqueSortedResult, null, 2));

console.log(`✅ Done! Extracted labels saved to: ${outputPath}`);
