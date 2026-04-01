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

export function extractDiaRegex7(arr) {
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

