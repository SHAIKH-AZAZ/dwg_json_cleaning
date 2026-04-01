import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let count = 0;

const inputPath = path.join(__dirname, "../../cleaned_texts.json");
const outputPath = path.join(__dirname, "08DiaBar.json");


// Supports:
// Y8 AT 200C/C
// 2L-Y10 AT 100C/C
// 2L-Y10 AT 100 C/C+
const singleLabelRegex =
  /^\s*(?:(\d+L)-)?(Y)(\d+)\s*AT\s*(\d+)\s*C\/C\+?\s*$/i;

export function extractDiaRegex8(arr) {
  let allMatches = [];

  for (const str of arr) {
    const match = str.match(singleLabelRegex);

    if (match) {
      count++;
      // console.log(match);

      allMatches.push([...match]); // same output structure as your previous regex
    }
  }

  return allMatches;
}

