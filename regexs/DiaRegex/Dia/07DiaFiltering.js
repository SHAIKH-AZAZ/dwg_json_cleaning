import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let count = 0;

const inputPath = path.join(__dirname, "../../cleaned_texts.json");
const outputPath = path.join(__dirname, "07DiaBar.json");
const singleLabelRegex =
  /^(?:(\d+-)\s*)?([TØY]|TOR)\s*(\d+)\s*([-@]\s*\d+(?:\+\d+)*\s*)+(?:\s*mm\s*)?C\/C\b.*$/i;

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

console.log(`✅ Done! Extracted labels saved to: ${outputPath} with matched ${count}`);


/**
 * [
  'T12@150C/C',
  T12-100C/C this have to be added 
  undefined, for number  => 12T@150C/C , 12 number will be these
  'T', special chanracter 
  '12', bar dia 
  '@150', spacing 
  index: 0,
  input: 'T12@150C/C',
  groups: undefined
]
 */