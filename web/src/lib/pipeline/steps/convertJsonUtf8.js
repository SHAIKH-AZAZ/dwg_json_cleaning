import fs from "fs";
import path from "path";
import { Transform } from "stream";
import { jsonrepair } from "jsonrepair";

const fsp = fs.promises;
const MAX_MEMORY_SIZE = 50 * 1024 * 1024;

export async function convertSmallFileToUTF8(filePath) {
  const buf = await fsp.readFile(filePath);
  const attempts = ["utf8", "utf16le", "latin1", "ascii"];
  let lastError = null;

  for (const enc of attempts) {
    try {
      let s = buf.toString(enc);

      if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);

      s = s
        .replace(/\u0000/g, "")
        .replace(/\bnan\b/gi, "null")
        .replace(/\binf\b/gi, "null")
        .replace(/\b-inff?\b/gi, "null");

      try {
        const content = JSON.parse(s);
        await fsp.writeFile(filePath, JSON.stringify(content, null, 2), "utf8");
        return true;
      } catch {
        const repaired = jsonrepair(s);
        const content = JSON.parse(repaired);
        await fsp.writeFile(filePath, JSON.stringify(content, null, 2), "utf8");
        return true;
      }
    } catch (err) {
      lastError = `${enc}: ${err.message}`;
    }
  }

  console.warn(`Could not parse ${path.basename(filePath)} -> ${lastError}`);
  return false;
}

export async function convertLargeFileToUTF8(filePath) {
  const tempPath = filePath + ".tmp";

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath, { encoding: "utf8" });
    const writeStream = fs.createWriteStream(tempPath, { encoding: "utf8" });

    const fixer = new Transform({
      transform(chunk, encoding, callback) {
        try {
          const fixed = chunk.toString().replace(/\bnan\b/gi, "null");
          callback(null, fixed);
        } catch (err) {
          callback(err);
        }
      }
    });

    readStream
      .pipe(fixer)
      .pipe(writeStream)
      .on("finish", async () => {
        try {
          await fsp.unlink(filePath);
          await fsp.rename(tempPath, filePath);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);

    readStream.on("error", reject);
  });
}

export async function convertJsonToUTF8(jsonDir, concurrency = 4) {
  const files = await fsp.readdir(jsonDir);
  const jsonFiles = files.filter(n => n.toLowerCase().endsWith(".json"));

  let converted = 0;
  let active = 0;
  let idx = 0;

  async function processFile(name) {
    const filePath = path.join(jsonDir, name);

    try {
      const stats = await fsp.stat(filePath);
      const isLarge = stats.size > MAX_MEMORY_SIZE;

      let success = false;

      if (isLarge) {
        console.log(`Streaming large file: ${name}`);
        success = await convertLargeFileToUTF8(filePath);
      } else {
        success = await convertSmallFileToUTF8(filePath);
      }

      if (success) converted++;
    } catch (err) {
      console.error(`Error converting ${name}: ${err.message}`);
    }
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

  return converted;
}