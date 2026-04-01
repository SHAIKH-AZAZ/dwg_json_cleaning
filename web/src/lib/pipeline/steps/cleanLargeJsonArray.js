import fs from "fs";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import streamArray from "stream-json/streamers/stream-array.js";
import { cleanText } from "../utils/cleanText.js";

export async function cleanLargeJsonArray(
  inputFile,
  outputFile,
  { dedupe = false, dedupeCap = 1500000 } = {}
) {
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Input file not found: ${inputFile}`);
  }

  const readStream = fs.createReadStream(inputFile);
  const writeStream = fs.createWriteStream(outputFile, { encoding: "utf8" });
  const pipeline = chain([readStream, parser(), streamArray()]);

  writeStream.write("[\n");

  let first = true;
  let total = 0;
  let kept = 0;
  let empty = 0;
  let dupes = 0;
  let nonString = 0;
  let seen = dedupe ? new Set() : null;

  function emit(s) {
    const ok = writeStream.write(s);
    if (!ok) {
      pipeline.pause();
      writeStream.once("drain", () => pipeline.resume());
    }
  }

  pipeline.on("data", ({ value }) => {
    total++;

    let str = typeof value === "string" ? value : value == null ? "" : String(value);
    if (typeof value !== "string") nonString++;

    const cleaned = cleanText(str);
    if (!cleaned) {
      empty++;
      return;
    }

    if (seen) {
      if (seen.size >= dedupeCap) {
        console.warn(`Dedupe disabled after reaching cap (${dedupeCap}).`);
        seen = null;
      } else if (seen.has(cleaned)) {
        dupes++;
        return;
      } else {
        seen.add(cleaned);
      }
    }

    const json = JSON.stringify(cleaned);
    if (!first) emit(",\n");
    emit("  " + json);
    first = false;
    kept++;
  });

  return new Promise((resolve, reject) => {
    pipeline.on("end", () => {
      writeStream.write("\n]\n");
      writeStream.end(() => resolve({ total, kept, empty, nonString, dupes }));
    });

    pipeline.on("error", err => {
      try {
        writeStream.destroy();
      } catch {}
      reject(err);
    });

    writeStream.on("error", err => {
      try {
        readStream.destroy();
      } catch {}
      reject(err);
    });
  });
}
