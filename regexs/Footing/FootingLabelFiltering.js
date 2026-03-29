import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Allow __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Path to your JSON file
const inputPath = path.join(__dirname, "../cleaned_texts.json");
const outputPath = path.join(__dirname, "FootingLabel.json");
let count =0;

const singleLabelRegex =
  /\b(?:F\d+[A-Za-z]*|BF\d+[A-Za-z]*|AF\d+[A-Za-z]*|CF\d+[A-Za-z]*|NF\d+[A-Za-z]*|BRF\d+[A-Za-z]*|Raft-\d+[A-Za-z]*|R\d+[A-Za-z]*|RW\d*[A-Za-z]|CP\d+[A-Za-z]*|AC\d+[A-Za-z]*|FC\d+[A-Za-z]*|FP\d+[A-Za-z]*|ARF\d+[A-Za-z]*|CWF\d+[A-Za-z]*|LPW\d+[A-Za-z])\b/gi;
  // this regex is for seperating prefix and suffix

const seperationRegex = /^([A-Za-z-]+)(\d+[A-Za-z]*)?$/;
  // const singleLabelRegex = /^\s*(C|F|BF|CP|CF|RW|AC|GC|BC|NC|SW)(\d*[A-Za-z]*)\s*$/;
  // const singleLabelRegex =
  // /^\s*(C|F|BF|CP|CF|RW|AF|BRF|BC|NC|SW|AC|RW)(\d+[A-Za-z]*)\s*$/i;

/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
function extractLabelsFromArray(arr) {
  let allMatches = [];

  for (const str of arr) {
  const Match = str.match(singleLabelRegex);  // returns array or null
  // console.log(Match);

  if (Match !== null) {
    for (let Smatch of Match) {
      const parts = Smatch.match(seperationRegex);
      if (parts !== null) { 
        // console.log(parts);
        count++;
          // ✅ filter null
        allMatches.push(parts);
      }
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

console.log(`✅ Done! Extracted labels saved to: ${outputPath}`);
console.log(`Total Matches : ${count}`);
