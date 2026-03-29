import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Allow __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Path to your JSON file
const inputPath = path.join(__dirname, "../../cleaned_texts.json");
const outputPath = path.join(__dirname, "03DiaBar.json");

// ✅ Regex for labels (word boundary + global search)
const singleLabelRegex =
  /^(\d+)\s*-?\s*([TØY])\s*(\d+)(?:\(([^)]+)\))?(?:([A-Z]+))?$/;


/**
 * Extracts labels from an array of strings and flattens into single array
 * @param {string[]} arr - Array of input strings
 * @returns {string[]} all matches
 */
function extractLabelsFromArray(arr) {
  let allMatches = [];

  for (const str of arr) {
    const m = str.match(singleLabelRegex);
    if (m !== null) {
      console.log(m);
    }
    allMatches.push(m);

    
    
    singleLabelRegex.lastIndex = 0; // reset regex
  }

  return allMatches;
}

// ✅ Load JSON
const raw = fs.readFileSync(inputPath, "utf-8");
const jsonArray = JSON.parse(raw);

// ✅ Extract all matches into one array
const result = extractLabelsFromArray(jsonArray);
const  SeTresult = [...new Set(result)]

// ✅ Save filtered result
fs.writeFileSync(outputPath, JSON.stringify(SeTresult.sort(), null, 2));

console.log(`✅ Done! Extracted labels saved to: ${outputPath}`);

/**
 * [
  '1 - T12',  original string 
  '1', repition number 
  'T', spacial character 
  '12', bar dia 
  undefined,
  undefined,
  index: 0,
  input: '1 - T12',  
  groups: undefined
]

/^(\d+)\s*(TOR|TØY|T|Y)\s*@\s*(\d+)\s*C\/C$/i

 */