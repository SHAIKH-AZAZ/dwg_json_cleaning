import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, "../../../cleaned_texts.json");
const outputPath = path.join(__dirname, "02DiaBar_INCH_SPACING.json");

/* This regular expression `const singleLabelRegex =
/^(?:(\d+)-)?(\d+)(TOR|T|Y|Φ)\s*(?:@|-)?\s*(\d+)\s*IN\s*(?:C\/C)?$/i;` is used to match and extract
specific patterns from strings. Here is a breakdown of what each part of the regex does: */
const singleLabelRegex =
  /^(?:(\d+(?:L)?)-)?(\d+)(TOR|T|Y|Φ)\s*(?:@|-)?\s*(\d+)\s*IN\s*(?:C\/C\b.*)?$/i;

let count = 0;

function extractLabelsFromArray(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex)
    if (match) {
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
const Set_result = [
  ...new Set(result.map(r => JSON.stringify(r)))
].map(r => JSON.parse(r));

// ✅ Save
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`✅ Done! Extracted labels saved to: ${outputPath} and matched ${count}`);


