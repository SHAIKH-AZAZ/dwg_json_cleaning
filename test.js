import fs from "node:fs/promises";

import { extractSteelOfGrade } from "./regexs/GradeOfSteel/SteelGradeFiltering.js";
import { cleanText } from "./utils/cleanText.js";

async function readJSON() {
  try {
    const data = await fs.readFile("./drawing_json_converted/entityMtextText.json", "utf-8");
    const jsonData = JSON.parse(data);
    const inputArray = Array.isArray(jsonData) ? jsonData : Object.values(jsonData);

    const compareData = inputArray.map((item) => ({
      original: item,
      cleaned: cleanText(item),
    }));

    await fs.writeFile("compare.json", JSON.stringify(compareData, null, 2));
  } catch (error) {
    console.error(error);
  }
}

async function run() {
  await readJSON();

  const data = await fs.readFile("./drawing_json_converted/entityMtextText.json", "utf-8");
  const jsonData = JSON.parse(data);
  const inputArray = Array.isArray(jsonData) ? jsonData : Object.values(jsonData);

  // 🔹 Add direct test cases here
  const testInputs = [
    "Fe550",
    "Fe525D",
    "Fe 500",
    "Fe400",
    "Fe-415",
    "Random text Fe550D extra",
    "Fe432A"
  ];

  // Merge file data + test data
  const combinedInput = [...testInputs];

  const cleanedTexts = combinedInput.map(cleanText);
  const result = extractSteelOfGrade(cleanedTexts);

  console.log("Final Result:" , result.map(item => {console.log(item);
  }));
}

await run();