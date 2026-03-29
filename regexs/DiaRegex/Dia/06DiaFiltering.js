import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let count =0;
const inputPath = path.join(__dirname, "../../cleaned_texts.json");
const outputPath = path.join(__dirname, "06DiaBar.json");
const singleLabelRegex =
  /^\s*(\d+L)\s*-\s*([TØY]|TOR)\s*(\d+)(?:[-@]\s*(\d+))?(?:\s*C\/C)?\s*$/i;


function extractLabelsFromArray(arr) {
  let allMatches = [];
  
  for (const str of arr) {
    const match = str.match(singleLabelRegex)
    if (match) {
      // console.log(match);
      count++;
      allMatches.push([...match]);
    }
  }
  
  return allMatches;
}

const raw = fs.readFileSync(inputPath, "utf-8");
const jsonArray = JSON.parse(raw);

const result = extractLabelsFromArray(jsonArray);

// ✅ Proper deduplication
const SeTresult = [
  ...new Set(result.map(r => JSON.stringify(r)))
].map(r => JSON.parse(r));

// ✅ Save
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`✅ Done! Extracted labels saved to: ${outputPath} and count is 06DiaRegex ${count}`);


/**
 [
  '4-16Y-100 C/C ',
  4, -> number 
  16, -> bar dia 
'Y', -> special symbol
100, spacing 
]
 */
