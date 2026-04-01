import fs from "fs";
import path from "path";
import { Transform } from "stream";
import { chain } from "stream-chain";
import { parser } from "stream-json";

import streamArray from "stream-json/streamers/stream-array.js";
import pick from "stream-json/filters/pick.js";

import { parseJsonWithEncodings } from "../utils/parseJsonWithEncodings.js";
import { sanitizeJsonLikeText } from "../utils/sanitizeJsonLikeText.js";

const fsp = fs.promises;
const MAX_MEMORY_SIZE = 50 * 1024 * 1024;

export async function extractFromFileSmall(filePath, failedLog) {
  let data = null;

  try {
    const buf = await fsp.readFile(filePath);
    data = parseJsonWithEncodings(buf, filePath);
  } catch (err) {
    console.error(`Error reading ${filePath}: ${err.message}`);
  }

  if (data == null) {
    fs.appendFileSync(failedLog, filePath + "\n", { encoding: "utf8" });
    return [];
  }

  if (Array.isArray(data)) return [];

  let objects = data.OBJECTS ?? [];
  if (!Array.isArray(objects) && objects && typeof objects === "object") {
    objects = Object.values(objects);
  }

  if (!Array.isArray(objects)) objects = [];

  const texts = [];

  for (const obj of objects) {
    if (obj && typeof obj === "object") {
      const ent = String(obj.entity ?? "").toUpperCase();

      if (ent === "MTEXT" || ent === "TEXT" || ent === "USER_TEXT") {
        const t = obj.text ?? obj.text_value;
        if (t != null) texts.push(String(t));
      }
    }
  }

  return texts;
}

export async function extractFromFileLarge(filePath, failedLog) {
  return new Promise(resolve => {
    const texts = [];
    const readStream = fs.createReadStream(filePath, {
      encoding: "utf8",
      highWaterMark: 64 * 1024
    });

    let carry = "";

    const sanitizer = new Transform({
      decodeStrings: false,
      transform(chunk, _, cb) {
        try {
          let str = carry + chunk;
          carry = str.slice(-50);
          str = str.slice(0, -50);
          str = sanitizeJsonLikeText(str);
          cb(null, str);
        } catch (err) {
          cb(err);
        }
      },
      flush(cb) {
        try {
          cb(null, sanitizeJsonLikeText(carry));
        } catch (err) {
          cb(err);
        }
      }
    });

    const pipeline = chain([
      readStream,
      sanitizer,
      parser(),
      pick({ filter: "OBJECTS" }),
      streamArray()
    ]);

    pipeline.on("data", ({ value }) => {
      if (value && typeof value === "object") {
        const ent = String(value.entity ?? "").toUpperCase();
        if (ent === "MTEXT" || ent === "TEXT" || ent === "USER_TEXT") {
          const t = value.text ?? value.text_value;
          if (t != null) texts.push(String(t));
        }
      }
    });

    pipeline.on("end", () => resolve(texts));

    pipeline.on("error", err => {
      console.error(`Error streaming ${filePath}: ${err.message}`);
      fs.appendFileSync(failedLog, filePath + "\n", { encoding: "utf8" });
      resolve([]);
    });
  });
}

export async function extractFromFile(filePath, failedLog) {
  try {
    const stats = await fsp.stat(filePath);

    if (stats.size > MAX_MEMORY_SIZE) {
      return await extractFromFileLarge(filePath, failedLog);
    }

    return await extractFromFileSmall(filePath, failedLog);
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
    fs.appendFileSync(failedLog, filePath + "\n", { encoding: "utf8" });
    return [];
  }
}

export async function extractTextsFromJsonFolder(
  jsonDir,
  outArrayPath,
  labelsPath,
  failedLogPath,
  concurrency = 4
) {
  if (fs.existsSync(failedLogPath)) fs.unlinkSync(failedLogPath);

  const files = await fsp.readdir(jsonDir);
  const jsonFiles = files.filter(
    n =>
      n.toLowerCase().endsWith(".json") &&
      ![path.basename(outArrayPath), path.basename(labelsPath)].includes(n)
  );

  const outStream = fs.createWriteStream(outArrayPath, { encoding: "utf8" });
  outStream.write("[\n");

  let first = true;
  let extractedCount = 0;
  let active = 0;
  let idx = 0;

  function writeItems(items) {
    if (items.length === 0) return;

    let chunk = "";
    for (const item of items) {
      if (!first) chunk += ",\n";
      chunk += "  " + JSON.stringify(item);
      first = false;
    }

    outStream.write(chunk);
    extractedCount += items.length;
  }

  async function processFile(name) {
    const fp = path.join(jsonDir, name);
    const extracted = await extractFromFile(fp, failedLogPath);
    writeItems(extracted);
  }

  async function next() {
    while (active < concurrency && idx < jsonFiles.length) {
      const name = jsonFiles[idx++];
      active++;

      processFile(name).finally(() => {
        active--;
        next();
      });
    }
  }

  await next();
  while (active > 0) await new Promise(r => setTimeout(r, 50));

  outStream.write("\n]");
  await new Promise(r => outStream.end(r));

  await fsp.copyFile(outArrayPath, labelsPath);
  return extractedCount;
}
