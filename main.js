import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { arg } from "./utils/arg.js";
import { findDWGFiles } from "./utils/findDWGFiles.js";
import { convertDWGToJSON } from "./steps/convertDwgToJson.js";
import { extractTextsFromJsonFolder } from "./steps/extractTexts.js";
import { cleanLargeJsonArray } from "./steps/cleanLargeJsonArray.js";
import { extractBeamElements } from "./regexDataExtraction/Beam/extractBeamElements.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DWG_DIR = arg("--dwg", path.join(__dirname, "Dwg_drawing"));
const JSON_DIR = arg("--json", path.join(__dirname, "drawing_json_converted"));
const EXE_PATH = arg("--exe", path.join(__dirname, "libredwg-0.13.3.7852-win64", "dwgread.exe"));
const CLEAN_OUT = arg("--clean-out", path.join(__dirname, "cleanjson", "cleaned_texts.json"));
const REGEX_DATA_OUT = arg(
  "--regex-out",
  path.join(__dirname, "regexDataExtraction", "regexData.json")
);

const SKIP_CONVERT = process.argv.includes("--skip-convert");
const SKIP_EXTRACT = process.argv.includes("--skip-extract");
const SKIP_CLEAN = process.argv.includes("--skip-clean");
const SKIP_BEAM = process.argv.includes("--skip-beam");

const DEDUPE = process.argv.includes("--dedupe");
const DEDUPE_CAP = Number(arg("--dedupe-cap", "1500000"));
const CONCURRENCY = Math.max(1, Number(arg("--concurrency", "2")));

const FILTERED_JSON = path.join(JSON_DIR, "entityMtextText.json");
const LABELS_JSON = path.join(JSON_DIR, "labels.json");
const FAILED_LOG = path.join(JSON_DIR, "failed_files.txt");

fs.mkdirSync(JSON_DIR, { recursive: true });
fs.mkdirSync(path.dirname(CLEAN_OUT), { recursive: true });
fs.mkdirSync(path.dirname(REGEX_DATA_OUT), { recursive: true });

async function main() {
  if (!SKIP_CONVERT) {
    const exeOk = fs.existsSync(EXE_PATH);
    const dwgOk = fs.existsSync(DWG_DIR) && fs.lstatSync(DWG_DIR).isDirectory();

    if (!exeOk || !dwgOk) {
      console.error("Invalid path for dwgread.exe or DWG folder. Use --exe and --dwg.");
      process.exit(1);
    }
  }

  if (!SKIP_CONVERT) {
    const files = await findDWGFiles(DWG_DIR);

    if (files.length === 0) {
      console.warn("No DWG files found; skipping conversion.");
    } else {
      await convertDWGToJSON(files, JSON_DIR, EXE_PATH, CONCURRENCY);
    }
  }

  if (!SKIP_EXTRACT) {
    const count = await extractTextsFromJsonFolder(
      JSON_DIR,
      FILTERED_JSON,
      LABELS_JSON,
      FAILED_LOG,
      CONCURRENCY
    );
    console.log(`Extracted ${count} raw text entries`);
  }

  if (!SKIP_CLEAN) {
    const stats = await cleanLargeJsonArray(FILTERED_JSON, CLEAN_OUT, {
      dedupe: DEDUPE,
      dedupeCap: DEDUPE_CAP
    });

    console.log(stats);
  }

  if (!SKIP_BEAM) {
    const beamStats = await extractBeamElements(CLEAN_OUT, REGEX_DATA_OUT);
    console.log(`Extracted ${beamStats.totalMatches} beam labels to ${beamStats.outputPath}`);
  }

  console.log("Pipeline completed.");
}

main().catch(err => {
  console.error("Pipeline crashed:", err);
  process.exit(1);
});
