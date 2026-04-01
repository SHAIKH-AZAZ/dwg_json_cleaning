import fs from "fs";
import path from "path";
import { runDwgRead } from "../utils/runDwgRead.js";
import { convertJsonToUTF8 } from "./convertJsonUtf8.js";

const fsp = fs.promises;

export async function convertDWGToJSON(dwgFiles, outDir, dwgreadExe, concurrency = 2) {
  await fsp.mkdir(outDir, { recursive: true });

  let active = 0;
  let idx = 0;
  let ok = 0;
  let fail = 0;

  async function next() {
    if (idx >= dwgFiles.length) return;

    while (active < concurrency && idx < dwgFiles.length) {
      const dwgPath = dwgFiles[idx++];
      active++;

      (async () => {
        const base = path.parse(dwgPath).name + ".json";
        const out = path.join(outDir, base);
        const args = ["-O", "JSON", "-o", out, dwgPath];

        try {
          await runDwgRead(dwgreadExe, args);
          console.log(`Converted: ${dwgPath} -> ${out}`);
          ok++;
        } catch (e) {
          console.error(`Error converting ${dwgPath}: ${e.message}`);
          fail++;
        } finally {
          active--;
          await next();
        }
      })().catch(() => {});
    }

    if (active === 0 && idx >= dwgFiles.length) {
      console.log(`Conversion finished — OK: ${ok}, Failed: ${fail}`);

      if (ok > 0) {
        await convertJsonToUTF8(outDir, concurrency);
      }
    }
  }

  await next();
  while (active > 0) await new Promise(r => setTimeout(r, 50));
}