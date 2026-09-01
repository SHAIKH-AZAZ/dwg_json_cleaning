// Dia regexes mirrored verbatim from bbs-dwg-api:
//   src/services/parse-dwg/constants/RegexData.ts
//   src/services/parse-dwg/parsers/dia-parser.ts  (mixedLabelRegex)
// Keep names identical to the bbs constants so the two repos stay diffable.

export const DiaRegex1V3 = /^(?:(\d+)\s*-\s*(\d+)\s*([YTØ#]|TOR)|(\d+)\s*([YTØ#]|TOR))$/;
export const DiaRegex2V2 = /\b(\d+)\s*[-±,]?\s*([YTØ#]|TOR)\s*(\d+)\b/;
export const DiaRegex3V2 = /^(\d+)\s*-?\s*([TØY])\s*(\d+)(?:\(([^)]+)\))?(?:([A-Z]+))?$/;
export const DiaRegex4V4 = /^(?:(\d+-)\s*)?([TØY]|TOR)\s*(\d+)\s*([-@]\s*\d+(?:\+\d+)*\s*)+(?:C\/C)?(?:\s+.*)?$/i;
export const DiaRegex5V3 = /^(?:(\d+)-)?(\d+)(TOR|T|Y|Φ)(?:[-@])(\d+)((?:\+\d+)*)(?:\s*C\/C)?$/i;
export const DiaRegex6V2 = /^\s*(\d+L)\s*-\s*([TØY]|TOR)\s*(\d+)\s*[-@]?\s*(\d+)\s*$/i;
export const DiaRegex6V3 = /^(?:(\d+)\s*)?([TØY]|TOR)\s*(\d+)\s*([-@]\s*\d+(?:\+\d+)*\s*)+(?:C\/C)?(?:\s+.*)?$/i;
export const DiaRegex7V3 = /^(?:(\d+-)\s*)?([TØY]|TOR)\s*(\d+)\s*([-@]\s*\d+(?:\+\d+)*\s*)+(?:\s*mm\s*)?C\/C\b.*$/i;
export const DiaRegex8V1 = /^\s*(?:(\d+L)-)?(Y)(\d+)\s*AT\s*(\d+)\s*C\/C\+?\s*$/i;
export const DiaRegex9V1 = /^([TØY]|TOR)(\d+)-(\d+L)@(\d+)C\/C(?:\(([^)]+)\))?$/i;

export const DiaInchRegex1V1 = /^\s*(?:(\d+L)-)?([TØY]|TOR)\s*(\d+)\s*[@-]\s*(\d+)\s*IN\s*(?:C\/C\b.*)?$/i;
export const DiaInchRegex2V1 = /^(?:(\d+(?:L)?)-)?(\d+)(TOR|T|Y|Φ)\s*(?:@|-)?\s*(\d+)\s*IN\s*(?:C\/C\b.*)?$/i;

/**
 * Example: "2-Y16 + 3-T20 (T/B)"     (symbol before dia)
 *      or: "3-32T + 2-25T (T/B)"     (dia before symbol)
 *      or: "3-32T+2-25T TH."         (bare trailing annotation, no brackets)
 * Each of the two "+"-joined terms can use either order, independently.
 * Groups: count1, diaFirst1, symFirst1, symLast1, diaLast1,
 *         count2, diaFirst2, symFirst2, symLast2, diaLast2, note
 */
export const DiaMixedLabelRegex =
  /^\s*\(?\s*(\d+)\s*-\s*(?:(\d+)\s*([YTØ#]|TOR)|([YTØ#]|TOR)\s*(\d+))\s*\+\s*(\d+)\s*-\s*(?:(\d+)\s*([YTØ#]|TOR)|([YTØ#]|TOR)\s*(\d+))\s*\)?\s*(?:\(([^)]+)\))?(?:\s+.*)?$/i;
