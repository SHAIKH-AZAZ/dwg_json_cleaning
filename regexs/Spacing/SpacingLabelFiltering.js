// 05
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Allow __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let count = 0 ;
// ✅ Path to your JSON file
const inputPath = path.join(__dirname, "../cleaned_texts.json");
const outputPath = path.join(__dirname, "SpacingLabels.json");

// ✅ Regex for labels (word boundary + global search)
const singleLabelRegex =
  /^(.*?)\b(Y|T|Ø|TOR)\s*(\d+)?\s*((?:\s*(?:\+\s*)?\d*\s*[-@]\s*\d+)+)\s*(?:C\/C)?$/;

 // added "-" and "@" support for extraction 
// /^(.*?)\b(Y|T|Ø|TOR)\s*(\d+)?\s*((?:\s*(?:\+\s*)?\d*\s*@\s*\d+)+)\s*(?:C\/C)?$/i

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
      count++;
      // console.log(match.filter(v => v !== null && v !== undefined));
      // allMatches.push(match.filter(v => v !== null && v !== undefined));
      // console.log(match);ḥ
      allMatches.push(match);
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
fs.writeFileSync(outputPath, JSON.stringify(result.sort(), null, 2));

console.log(`✅ Done! Extracted labels saved to: ${outputPath} with this matches of Spacing regex  ${count}`);
