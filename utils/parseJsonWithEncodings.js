import path from "path";
import { jsonrepair } from "jsonrepair";

export function parseJsonWithEncodings(buf, filePath = "") {
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
        return JSON.parse(s);
      } catch {
        return JSON.parse(jsonrepair(s));
      }
    } catch (err) {
      lastError = `${enc}: ${err.message}`;
    }
  }

  if (filePath) {
    console.warn(`Failed parsing ${path.basename(filePath)} -> ${lastError}`);
  }

  return null;
}