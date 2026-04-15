import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { extractBeamLabels } from "./Beam/BeanLabelFiltering.js";
import { extractColumLabels } from "./Column/ColomLabelFiltering.js";
import { extractColomnXY } from "./ColomnXY/ColomnXYFiltering.js";
import { extractColomnDia } from "./ColumnDia/ColomDiaFiltering.js";
import { extractCoverOfConcrete } from "./CoverofConcrete/CoverConcreteFiltering.js";
import { extractInchSpacingDia01 } from "./DiaRegex/Dia/SPACING_INCH_WITH_DIA/01DiaFiltering.js";
import { extractInchSpacingDia02 } from "./DiaRegex/Dia/SPACING_INCH_WITH_DIA/02DiaFiltering.js";
import { extractDiaRegex1 } from "./DiaRegex/Dia/01DiaFiltering.js";
import { extractDiaRegex2 } from "./DiaRegex/Dia/02DiaFiltering.js";
import { extractDiaRegex3 } from "./DiaRegex/Dia/03DiaFiltering.js";
import { extractDiaRegex4 } from "./DiaRegex/Dia/04DiaFiltering.js";
import { extractDiaRegex5 } from "./DiaRegex/Dia/05DiaFiltering.js";
import { extractDiaRegex6 } from "./DiaRegex/Dia/06DiaFiltering.js";
import { extractDiaRegex7 } from "./DiaRegex/Dia/07DiaFiltering.js";
import { extractDiaRegex8 } from "./DiaRegex/Dia/08DiaFiltering.js";
import { extractDiaRegex9 } from "./DiaRegex/Dia/09DiaFiltering.js";
import { extractFooting } from "./Footing/FootingLabelFiltering.js";
import { extractFootingBar } from "./Footing Bar/FootingBaRLabelFiltering.js";
import { extractFootingRaft } from "./Footing Raft/FootingRaftLabelFiltering.js";
import { extractGradeOfConcrete } from "./GradeOfConcrete/GradeOfConcrete.js";
import { extractSteekOfGrade } from "./GradeOfSteel/SteekGradeFiltering.js";
import { extractLegOfStirrup } from "./LegOfStrip/LegStirrup.js";
import { extractSlabLabels } from "./slab/SlabLabelFiltering.js";
import { extractSpacingLabelFiltering } from "./Spacing/SpacingLabelFiltering.js";
import { extractSpacingTableInch } from "./Spacing/SpacingTable_INCH.js";
import { extractSpacingTable } from "./Spacing/SpacingTable.js";

// Enable __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runExtractionRegex(customInputPath = "../cleanjson/cleaned_texts.json") {
  try {
    const inputPath = path.isAbsolute(customInputPath) ? customInputPath : path.join(__dirname, customInputPath);

    const rawData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

    const inputArray = Array.isArray(rawData)
      ? rawData
      : Object.values(rawData);

    // Run all extractors
    const outputs = [
      { name: "./Beam/BeamLabels.json", data: extractBeamLabels(inputArray) },
      { name: "./Column/ColumnLabels.json", data: extractColumLabels(inputArray) },
      { name: "./ColumnXY/ColumnXYLabels.json", data: extractColomnXY(inputArray) },
      { name: "./ColumnDia/ColomnDia.json", data: extractColomnDia(inputArray) },
      { name: "./CoverofConcrete/CoverOfConcrete.json", data: extractCoverOfConcrete(inputArray) },
      { name: "./DiaRegex/Dia/SPACING_INCH_WITH_DIA/01DiaBar_INCH_SPACING.json", data: extractInchSpacingDia01(inputArray) },
      { name: "./DiaRegex/Dia/SPACING_INCH_WITH_DIA/02DiaBar_INCH_SPACING.json", data: extractInchSpacingDia02(inputArray) },
      { name: "./DiaRegex/Dia/01DiaBar.json", data: extractDiaRegex1(inputArray) },
      { name: "./DiaRegex/Dia/02DiaBar.json", data: extractDiaRegex2(inputArray) },
      { name: "./DiaRegex/Dia/03DiaBar.json", data: extractDiaRegex3(inputArray) },
      { name: "./DiaRegex/Dia/04DiaBar.json", data: extractDiaRegex4(inputArray) },
      { name: "./DiaRegex/Dia/05DiaBar.json", data: extractDiaRegex5(inputArray) },
      { name: "./DiaRegex/Dia/06DiaBar.json", data: extractDiaRegex6(inputArray) },
      { name: "./DiaRegex/Dia/07DiaBar.json", data: extractDiaRegex7(inputArray) },
      { name: "./DiaRegex/Dia/08DiaBar.json", data: extractDiaRegex8(inputArray) },
      { name: "./DiaRegex/Dia/09DiaBar.json", data: extractDiaRegex9(inputArray) },
      { name: "./Footing/FootingLabel.json", data: extractFooting(inputArray) },
      { name: "./Footing Bar/FootingBar.json", data: extractFootingBar(inputArray) },
      { name: "./Footing Raft/FootingRaft.json", data: extractFootingRaft(inputPath) },
      { name: "./GradeOfConcrete/GradeOfConcrete.json", data: extractGradeOfConcrete(inputArray) },
      { name: "./GradeOfSteel/GradeOfSteel.json", data: extractSteekOfGrade(inputArray) },
      { name: "./LegOfStrip/LegOfStirrup.json", data: extractLegOfStirrup(inputArray) },
      { name: "./slab/SlabLabels.json", data: extractSlabLabels(inputArray) },
      { name: "./Spacing/SpacingLabels.json", data: extractSpacingLabelFiltering(inputArray) },
      { name: "./Spacing/SpacingTable_INCH.json", data: extractSpacingTableInch(inputArray) },
      { name: "./Spacing/SpacingTable.json", data: extractSpacingTable(inputArray) },
    ];

    // Files writing omitted for web app, data is returned directly instead.
    console.log("✅ All data extracted successfully!");
    return outputs;
  } catch (err) {
    console.error("❌ Extraction failed:", err);
    throw err;
  }
}
