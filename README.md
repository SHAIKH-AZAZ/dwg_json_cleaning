# 🏗️ BBSteel AI Agent — Structural DWG Extractor

A full-stack AI-powered tool that extracts structural engineering data from AutoCAD `.dwg` files. It parses **beams, columns, footings, slabs, rebar spacing, concrete grades**, and more — all via a modern web interface.

---

## 📁 Project Structure

```
bbsteel ai agent/
├── web/                        ← Next.js web application (UI + API)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/upload/     ← File upload & extraction API route
│   │   │   ├── page.tsx        ← Main dashboard UI
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   └── lib/pipeline/       ← Extraction pipeline (copied from root)
│   │       ├── steps/          ← DWG → JSON, text extraction, cleaning
│   │       ├── utils/          ← Helper utilities
│   │       ├── regexs/         ← 25+ structural regex parsers
│   │       └── libredwg-*/     ← LibreDWG binary (dwgread.exe)
│
├── Dwg_drawing/                ← Place your .dwg files here (CLI mode)
├── main.js                     ← CLI pipeline orchestrator
├── automations.js              ← Selenium automation (optional)
├── steps/                      ← Pipeline steps (source)
├── utils/                      ← Utility scripts (source)
├── regexs/                     ← Regex extractors (source)
├── libredwg-0.13.3.7852-win64/ ← LibreDWG Windows binary
├── config.json                 ← Automation config
└── package.json
```

---

## ✅ Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| [Bun](https://bun.sh) | v1.3+ | JavaScript runtime & package manager |
| Windows OS | 64-bit | Optional if you want to use the bundled `dwgread.exe` |
| Node.js | v18+ | Optional, Bun handles everything |
| LibreDWG `dwgread` | In `PATH` on Linux/macOS | Required for extraction on non-Windows systems |

> **Note:** `dwgread.exe` (included in `libredwg-0.13.3.7852-win64/`) is Windows-only. On Linux/macOS, install `dwgread` system-wide and keep it on `PATH`, or point `DWGREAD_PATH` / `--exe` to the binary.

---

## 🚀 Quick Start — Web App

The web app is the recommended way to use this tool.

### 1. Install Bun (if not already installed)

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 2. Navigate to the web folder

```bash
cd "bbsteel ai agent/web"
```

### 3. Install dependencies

```bash
bun install
```

### 4. Start the development server

```bash
bun run dev
```

### 5. Open in browser

```
http://localhost:3000
```

### 6. Upload a DWG file

- Drag & drop any `.dwg` file onto the upload zone
- Or click the zone to browse and select a file
- Click **Process Data**
- Watch the 4-step pipeline process your file
- Browse the extracted structural data by category in the results dashboard

---

## 🖥️ CLI Mode (Without Web UI)

You can also run the extraction pipeline directly from the command line.

### 1. Install root dependencies

```bash
# From the root: "bbsteel ai agent/"
bun install
```

### 2. Place DWG files

Copy your `.dwg` files into the `Dwg_drawing/` folder.

### 3. Run the pipeline

```bash
node main.js
```

On Linux/macOS, the CLI now defaults to `dwgread` from your system `PATH`. If your binary is installed elsewhere, set it explicitly:

```bash
DWGREAD_PATH=/absolute/path/to/dwgread node main.js
```

#### CLI Flags

| Flag | Default | Description |
|---|---|---|
| `--dwg <path>` | `./Dwg_drawing` | Input folder with `.dwg` files |
| `--json <path>` | `./drawing_json_converted` | Output folder for raw JSON |
| `--exe <path>` | Windows: bundled `dwgread.exe`, Linux/macOS: `dwgread` | Path or command for the LibreDWG executable |
| `--clean-out <path>` | `./cleanjson/cleaned_texts.json` | Cleaned text output |
| `--regex-out <path>` | `./regexDataExtraction/regexData.json` | Final structured output |
| `--skip-convert` | — | Skip DWG → JSON conversion |
| `--skip-extract` | — | Skip text extraction |
| `--skip-clean` | — | Skip deduplication/cleaning |
| `--skip-regex` | — | Skip regex parsing |
| `--dedupe` | — | Enable deduplication |
| `--concurrency <n>` | `2` | Number of parallel workers |

#### Example — Skip conversion, only re-run regex

```bash
node main.js --skip-convert --skip-extract --skip-clean
```

---

## 🔧 Pipeline Overview

The extraction pipeline runs in 4 stages:

```
.dwg file
    │
    ▼
1. Convert DWG → JSON
   (using LibreDWG dwgread.exe)
    │
    ▼
2. Extract MTEXT / TEXT Entities
   (pulls raw text labels from drawing objects)
    │
    ▼
3. Clean & Deduplicate
   (removes noise, duplicates, limits memory)
    │
    ▼
4. Run 25+ Structural Regex Parsers
   (identifies Beams, Columns, Footings, Spacing, etc.)
    │
    ▼
Structured JSON output
```

---

## 📊 Extracted Categories

| Category | Description |
|---|---|
| **Beam Labels** | Beam identifiers (e.g. `B1`, `B-2A`) |
| **Column Labels** | Column identifiers (e.g. `C1`, `C-EXT`) |
| **Column XY** | Column grid coordinates |
| **Column Dia** | Column rebar diameters |
| **Cover of Concrete** | Concrete cover thickness values |
| **Grade of Concrete** | Concrete mix grades (e.g. `M25`, `M30`) |
| **Grade of Steel** | Steel grades (e.g. `Fe415`, `Fe500`) |
| **Dia Bars #1–#8** | Various rebar diameter patterns |
| **Dia + Inch Spacing #1–#2** | Combined dia+spacing patterns |
| **Footing Labels** | Foundation type identifiers |
| **Footing Bar** | Footing reinforcement bars |
| **Footing Raft** | Raft foundation details |
| **Leg of Stirrup** | Stirrup leg count |
| **Slab Labels** | Slab panel identifiers |
| **Spacing Labels** | Rebar spacing values |
| **Spacing Table** | Tabulated spacing data |
| **Spacing Table (Inch)** | Spacing data in imperial units |

---

## 🤖 Selenium Automation (Optional)

`automations.js` can auto-upload a DWG file to the BBSteel web dashboard.

### 1. Configure credentials

Edit `config.json`:

```json
{
  "baseUrl": "https://dev.app.bbsteel.in",
  "email": "your@email.com",
  "password": "yourpassword",
  "projectName": "Your Project",
  "importName": "Test Import",
  "drgNo": "DRG-001",
  "structureName": "Main Structure"
}
```

### 2. Install ChromeDriver

Make sure ChromeDriver matching your Chrome version is installed and available in `PATH`.

### 3. Run automation

```bash
node automations.js
```

---

## 🛠️ Development

### Web App

```bash
cd web
bun run dev       # Development server (http://localhost:3000)
bun run build     # Production build
bun run start     # Start production server
bun run lint      # Lint check
```

### Adding a New Regex Parser

1. Create a new file in `web/src/lib/pipeline/regexs/<Category>/YourFilter.js`
2. Export a function `export function extractX(inputArray) { ... }`
3. Import and register it in `web/src/lib/pipeline/regexs/main.js`
4. Add the output key to `CATEGORY_META` in `web/src/app/page.tsx` for UI display

---

## 🐛 Troubleshooting

### `dwgread.exe` not found
Make sure the `libredwg-0.13.3.7852-win64/` folder exists inside `web/src/lib/pipeline/`. The API route expects it at that path relative to `process.cwd()`.

### Build errors about missing modules
Run `bun install` inside the `web/` directory to install all Next.js dependencies.

### DWG conversion fails with exit code 1
The `.dwg` file may be from an unsupported AutoCAD version. LibreDWG 0.13.3 supports DWG versions up to R2018 (AC1032).

### Extraction returns empty results
The DWG may not contain `MTEXT`/`TEXT` entities with structural labels. Check that the drawing includes annotation/text layers.

---

## 📄 License

This project is private and owned by **Buniyadbyte / BBSteel**.

---

## 👥 Contact

For support or questions, reach out to the BBSteel AI development team.
