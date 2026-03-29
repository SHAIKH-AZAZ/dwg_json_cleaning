import fs from "fs";
import path from "path";

const beamLabelRegex =
  /(?<![A-Za-z0-9_-])(HB\d*[A-Za-z]?|RR\d*[A-Za-z]?|B\d+[A-Za-z]?|P\d+[A-Za-z]?|RB\d+[A-Za-z]?|PTBB\d+[A-Za-z]?|PB\d+[A-Za-z]?|SB\d+[A-Za-z]?|SBT\d+[A-Za-z]?|MB\d+[A-Za-z]?|AB\d+[A-Za-z]?|BB\d+[A-Za-z]?|CB\d+[A-Za-z]?|FFB\d+[A-Za-z]?|TFB\d+[A-Za-z]?|LB\d+[A-Za-z]?|LBK\d+[A-Za-z]?|DB\d+[A-Za-z]?|TB\d+[A-Za-z]?|bs\d+[A-Za-z]?|\d+F_B\d+[A-Za-z]?|MF_B\d+[A-Za-z]?|LGF_B\d+[A-Za-z]?|UGF_B\d+[A-Za-z]?|SGF_B\d+[A-Za-z]?|STB_B\d+[A-Za-z]?|LPTB-\d+[A-Za-z]?)(?![A-Za-z0-9_-])/gi;

function extractLabelsFromArray(values) {
  const matches = [];

  for (const value of values) {
    const text = typeof value === "string" ? value : value == null ? "" : String(value);
    beamLabelRegex.lastIndex = 0;

    for (const match of text.matchAll(beamLabelRegex)) {
      matches.push(match[0]);
    }
  }

  return matches;
}

function readExistingRegexData(outputPath) {
  if (!fs.existsSync(outputPath)) return {};

  try {
    const raw = fs.readFileSync(outputPath, "utf8").trim();
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export async function extractBeamElements(inputPath, outputPath) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const raw = fs.readFileSync(inputPath, "utf8");
  const jsonArray = JSON.parse(raw);

  if (!Array.isArray(jsonArray)) {
    throw new Error(`Expected a JSON array in: ${inputPath}`);
  }

  const matches = extractLabelsFromArray(jsonArray).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
  );

  const regexData = readExistingRegexData(outputPath);
  regexData.BeamElements = {
    totalMatches: matches.length,
    matches
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(regexData, null, 2) + "\n", "utf8");

  return {
    totalMatches: matches.length,
    outputPath
  };
}
