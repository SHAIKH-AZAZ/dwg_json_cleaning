import fs from "fs";
import path from "path";

export function getDefaultDwgReadPath(baseDir) {
  if (process.env.DWGREAD_PATH) {
    return process.env.DWGREAD_PATH;
  }

  if (process.platform === "win32") {
    return path.join(baseDir, "libredwg-0.13.3.7852-win64", "dwgread.exe");
  }

  return "dwgread";
}

export function isFilePathLike(command) {
  return path.isAbsolute(command) || /[\\/]/.test(command);
}

export function isConfiguredDwgReadAvailable(command) {
  if (!command) {
    return false;
  }

  if (isFilePathLike(command)) {
    return fs.existsSync(command);
  }

  return true;
}
