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


export function extractDiaRegex6(arr) {
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

