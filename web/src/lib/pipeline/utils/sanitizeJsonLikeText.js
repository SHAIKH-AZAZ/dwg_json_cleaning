export function sanitizeJsonLikeText(str) {
  return str
    .replace(/\u0000/g, "")
    .replace(/\bnan\b/gi, "null")
    .replace(/\binf\b/gi, "null")
    .replace(/\b-infinity\b/gi, "null")
    .replace(/\binfinity\b/gi, "null")
    .replace(/(:\s*-?\d+)\.(\s*[,}\]])/g, "$1.0$2")
    .replace(/:\s*-\.(\s*[,}\]])/g, ": null$1")
    .replace(/:\s*\+\.(\s*[,}\]])/g, ": null$1")
    .replace(/:\s*\.(\d+)(\s*[,}\]])/g, ": 0.$1$2")
    .replace(/:\s*-\.(\d+)(\s*[,}\]])/g, ": -0.$1$2");
}