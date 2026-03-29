export function cleanText(input) {
  if (typeof input !== "string") return "";
  let text = input;
  try {
    text = text
      .replace(/\\A\d+;/g, "")
      .replace(/\\f[^;]*;/g, "")
      .replace(/\\p[^;]*;/g, "")
      .replace(/\\\s+[A-Z]+/g, "")
      .replace(/\s+\\\\[\s\\]+/g, " ")
      .replace(/\\\\P|\\P/g, " ")
      .replace(/"/g, "IN")
      .replace(/\\\\[Ll]|\\L/g, "")
      .replace(/\\\\\\?\d+/g, " ")
      .replace(/\\[a-zA-Z][^;]*;/g, "")
      .replace(/%%[cdpU]/gi, m => {
        if (/%%c/i.test(m)) return "Ø";
        if (/%%d/i.test(m)) return "°";
        if (/%%p/i.test(m)) return "±";
        return "";
      })
      .replace(/\[AL]/g, " ")
      .replace(/\pxq[clr];/gi, " ")
      .replace(/\C\d+;/g, " ")
      .replace(/[{}]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return text;
  } catch {
    return String(input).trim();
  }
}
