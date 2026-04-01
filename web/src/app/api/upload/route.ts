import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";
import { convertDWGToJSON } from "@/lib/pipeline/steps/convertDwgToJson";
import { extractTextsFromJsonFolder } from "@/lib/pipeline/steps/extractTexts";
import { cleanLargeJsonArray } from "@/lib/pipeline/steps/cleanLargeJsonArray";
import { runExtractionRegex } from "@/lib/pipeline/regexs/main";

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

/**
 * Resolves the path to the dwgread executable.
 *
 * Priority:
 *   1. DWGREAD_PATH env variable (recommended for Linux/macOS)
 *   2. Bundled Windows binary  (libredwg-0.13.3.7852-win64/dwgread.exe)
 *   3. System PATH             (dwgread installed via apt/brew/etc.)
 */
function getDwgReadPath(cwd: string): string {
  // 1. Explicit env override
  if (process.env.DWGREAD_PATH) {
    return process.env.DWGREAD_PATH;
  }

  // 2. Bundled Windows binary
  if (process.platform === "win32") {
    return path.join(
      cwd,
      "src",
      "lib",
      "pipeline",
      "libredwg-0.13.3.7852-win64",
      "dwgread.exe"
    );
  }

  // 3. System-installed dwgread (Linux / macOS)
  //    Assumes `dwgread` is on PATH (e.g. installed via `apt install libredwg-dev`)
  return "dwgread";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".dwg")) {
      return NextResponse.json({ error: "File must be a .dwg format" }, { status: 400 });
    }

    const cwd = process.cwd();
    const tmpDir = path.join(cwd, ".tmp_pipeline", Date.now().toString());
    const dwgDir = path.join(tmpDir, "dwg");
    const jsonDir = path.join(tmpDir, "json");

    ensureDir(dwgDir);
    ensureDir(jsonDir);

    const dwgPath = path.join(dwgDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(dwgPath, buffer);

    console.log(`[API] Platform: ${process.platform}`);
    console.log(`[API] Saved DWG to ${dwgPath}`);

    const exePath = getDwgReadPath(cwd);
    console.log(`[API] Using dwgread: ${exePath}`);

    const filteredJson = path.join(jsonDir, "entityMtextText.json");
    const labelsJson   = path.join(jsonDir, "labels.json");
    const failedLog    = path.join(jsonDir, "failed_files.txt");
    const cleanOut     = path.join(tmpDir, "cleanjson", "cleaned_texts.json");
    ensureDir(path.dirname(cleanOut));

    // Phase 1: Convert DWG → JSON
    console.log("[API] Phase 1: convertDWGToJSON...");
    await convertDWGToJSON([dwgPath], jsonDir, exePath, 2);

    // Phase 2: Extract Texts
    console.log("[API] Phase 2: extractTextsFromJsonFolder...");
    await extractTextsFromJsonFolder(jsonDir, filteredJson, labelsJson, failedLog, 2);

    // Phase 3: Clean
    console.log("[API] Phase 3: cleanLargeJsonArray...");
    await cleanLargeJsonArray(filteredJson, cleanOut, { dedupe: true, dedupeCap: 1500000 });

    // Phase 4: Regex extraction
    console.log("[API] Phase 4: runExtractionRegex...");
    const extractionResults = runExtractionRegex(cleanOut);

    // Cleanup temp files (non-blocking)
    fs.rm(tmpDir, { recursive: true, force: true }, () => {});

    return NextResponse.json({
      message: "Extraction successful",
      data: extractionResults,
    });

  } catch (error: any) {
    console.error("[API ERROR]:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
