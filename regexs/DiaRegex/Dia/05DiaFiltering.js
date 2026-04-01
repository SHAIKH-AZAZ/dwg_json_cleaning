import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, "../../cleaned_texts.json");
const outputPath = path.join(__dirname, "05DiaBar.json");
const singleLabelRegex = /^(?:(\d+)-)?(\d+)(TOR|T|Y|Φ)(?:[-@])(\d+)((?:\+\d+)*)(?:\s*C\/C)?$/i;

let count = 0;

export function extractDiaRegex5(arr) {
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

