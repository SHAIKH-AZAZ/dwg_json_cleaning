import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, "../../cleaned_texts.json");
const outputPath = path.join(__dirname, "05DiaBar.json");
const singleLabelRegex = /^(?:(\d+)-)?(\d+)(TOR|T|Y|Φ)(?:[-@])(\d+)((?:\+\d+)*)(?:\s*C\/C)?$/i;

let count = 0;

function extractLabelsFromArray(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex)
    if (match) {
      // console.log(match);
      count++;
      // console.log(count)
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

console.log(`✅ Done! Extracted labels saved to: ${outputPath} and matched ${count}`);


/**
[
'4-16Y-100 C/C ',
4, -> number 
16, -> bar dia 
'Y', -> special symbol
100, spacing 
]
 */