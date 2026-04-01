"use client";

import React, { useState, useRef, useCallback } from "react";

// ─── Category meta ────────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { icon: string; color: string; label: string }> = {
  "BeamLabels.json":            { icon: "⬛", color: "#38bdf8", label: "Beam Labels" },
  "ColumnLabels.json":          { icon: "🏛️", color: "#a78bfa", label: "Column Labels" },
  "ColumnXYLabels.json":        { icon: "📍", color: "#f472b6", label: "Column XY" },
  "ColomnDia.json":             { icon: "⭕", color: "#fb923c", label: "Column Dia" },
  "CoverOfConcrete.json":       { icon: "🪨", color: "#34d399", label: "Cover of Concrete" },
  "01DiaBar_INCH_SPACING.json": { icon: "📏", color: "#fbbf24", label: "Dia #1 (Inch)" },
  "02DiaBar_INCH_SPACING.json": { icon: "📏", color: "#fbbf24", label: "Dia #2 (Inch)" },
  "01DiaBar.json":              { icon: "🔩", color: "#60a5fa", label: "Dia Bar #1" },
  "02DiaBar.json":              { icon: "🔩", color: "#60a5fa", label: "Dia Bar #2" },
  "03DiaBar.json":              { icon: "🔩", color: "#60a5fa", label: "Dia Bar #3" },
  "04DiaBar.json":              { icon: "🔩", color: "#60a5fa", label: "Dia Bar #4" },
  "05DiaBar.json":              { icon: "🔩", color: "#60a5fa", label: "Dia Bar #5" },
  "06DiaBar.json":              { icon: "🔩", color: "#60a5fa", label: "Dia Bar #6" },
  "07DiaBar.json":              { icon: "🔩", color: "#60a5fa", label: "Dia Bar #7" },
  "08DiaBar.json":              { icon: "🔩", color: "#60a5fa", label: "Dia Bar #8" },
  "FootingLabel.json":          { icon: "🏗️", color: "#2dd4bf", label: "Footing Labels" },
  "FootingBar.json":            { icon: "🏗️", color: "#2dd4bf", label: "Footing Bar" },
  "FootingRaft.json":           { icon: "🏗️", color: "#2dd4bf", label: "Footing Raft" },
  "GradeOfConcrete.json":       { icon: "🧱", color: "#e879f9", label: "Grade of Concrete" },
  "GradeOfSteel.json":          { icon: "⚙️", color: "#f87171", label: "Grade of Steel" },
  "LegOfStirrup.json":          { icon: "🔗", color: "#facc15", label: "Leg of Stirrup" },
  "SlabLabels.json":            { icon: "🟦", color: "#818cf8", label: "Slab Labels" },
  "SpacingLabels.json":         { icon: "📐", color: "#4ade80", label: "Spacing Labels" },
  "SpacingTable_INCH.json":     { icon: "📊", color: "#f97316", label: "Spacing Table (Inch)" },
  "SpacingTable.json":          { icon: "📊", color: "#f97316", label: "Spacing Table" },
};
const getMeta = (key: string) =>
  CATEGORY_META[key] ?? { icon: "📄", color: "#38bdf8", label: key.replace(".json", "") };

const getCount = (data: any): number => {
  if (Array.isArray(data)) return data.length;
  if (data && typeof data === "object") return Object.keys(data).length;
  return 0;
};

// ─── Inline style constants ───────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "#060d1a",
    backgroundImage:
      "linear-gradient(rgba(56,189,248,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.03) 1px,transparent 1px)",
    backgroundSize: "40px 40px",
    position: "relative" as const,
    fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
    color: "#f0f6ff",
  },
  orb1: {
    position: "fixed" as const,
    width: 600, height: 600, borderRadius: "50%",
    background: "radial-gradient(circle,rgba(56,189,248,.1) 0%,transparent 70%)",
    top: -200, right: -150, pointerEvents: "none" as const, zIndex: 0,
  },
  orb2: {
    position: "fixed" as const,
    width: 600, height: 600, borderRadius: "50%",
    background: "radial-gradient(circle,rgba(167,139,250,.08) 0%,transparent 70%)",
    bottom: -200, left: -150, pointerEvents: "none" as const, zIndex: 0,
  },
  nav: {
    position: "relative" as const, zIndex: 10,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 32px",
    borderBottom: "1px solid rgba(255,255,255,.06)",
    backdropFilter: "blur(10px)",
  },
  navBrand: { display: "flex", alignItems: "center", gap: 10 },
  navLogo: {
    width: 34, height: 34, borderRadius: 10,
    background: "linear-gradient(135deg,#38bdf8,#7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 800, fontSize: 14,
  },
  navTitle: { fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "#f0f6ff" },
  navPill: {
    fontSize: 11, padding: "4px 12px", borderRadius: 99,
    border: "1px solid rgba(255,255,255,.1)", color: "#8ba3c7",
  },
  main: {
    position: "relative" as const, zIndex: 10,
    display: "flex", flexDirection: "column" as const,
    alignItems: "center", justifyContent: "center",
    flex: 1, padding: "40px 24px",
  },
  card: {
    width: "100%", maxWidth: 520,
    background: "rgba(13,24,41,0.75)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(56,189,248,.12)",
    borderRadius: 24,
    padding: 32,
    boxShadow: "0 24px 64px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.05)",
  },
  heading: {
    textAlign: "center" as const, fontSize: 32, fontWeight: 900,
    letterSpacing: "-0.03em", marginBottom: 8,
  },
  headingAccent: {
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(135deg,#38bdf8,#a78bfa)",
    backgroundClip: "text",
  },
  subText: { textAlign: "center" as const, color: "#8ba3c7", fontSize: 13, marginBottom: 28 },
  dropZone: (dragging: boolean, hasFile: boolean): React.CSSProperties => ({
    border: `2px dashed ${hasFile ? "#2dd4bf" : dragging ? "#38bdf8" : "rgba(56,189,248,.3)"}`,
    borderRadius: 16,
    minHeight: 180,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 12,
    cursor: "pointer", padding: "24px 20px",
    textAlign: "center",
    background: hasFile
      ? "rgba(45,212,191,.05)"
      : dragging
      ? "rgba(56,189,248,.05)"
      : "rgba(56,189,248,.02)",
    transition: "all .25s ease",
    marginBottom: 24,
  }),
  iconBox: (color: string): React.CSSProperties => ({
    width: 52, height: 52, borderRadius: 14,
    background: `${color}14`,
    border: `1px solid ${color}33`,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  }),
  primaryBtn: (disabled: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 8, width: "100%", padding: "14px 24px",
    border: "1px solid rgba(56,189,248,.4)",
    borderRadius: 50, fontWeight: 700, fontSize: 14,
    letterSpacing: ".03em", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.35 : 1,
    background: "linear-gradient(135deg,rgba(56,189,248,.18),rgba(167,139,250,.18))",
    color: "#38bdf8", fontFamily: "inherit",
    transition: "all .25s ease",
    boxShadow: disabled ? "none" : "0 0 20px rgba(56,189,248,.15)",
  }),
  errorBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)",
    color: "#fca5a5", fontSize: 13, borderRadius: 12, padding: "10px 14px", marginBottom: 16,
  },
  divider: { borderTop: "1px solid rgba(255,255,255,.06)", margin: "28px 0 20px" },
  stepsTitle: { fontSize: 10, textTransform: "uppercase" as const, letterSpacing: ".12em", color: "#4b6490", fontWeight: 700, marginBottom: 14 },
  stepRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  stepNum: {
    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
    background: "rgba(56,189,248,.08)", border: "1px solid rgba(56,189,248,.25)",
    color: "#38bdf8", fontSize: 11, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  stepLabel: { fontSize: 12, color: "#8ba3c7" },
};

// ─── Tag chips ────────────────────────────────────────────────────────────────
function TagList({ items }: { items: string[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, 60);
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {visible.map((v, i) => (
          <span key={i} style={{
            background: "rgba(56,189,248,.08)", border: "1px solid rgba(56,189,248,.22)",
            color: "#93c5fd", fontSize: 12, padding: "4px 12px", borderRadius: 99,
            fontFamily: "monospace", fontWeight: 500,
          }}>{v}</span>
        ))}
      </div>
      {items.length > 60 && (
        <button onClick={() => setShowAll(s => !s)}
          style={{ marginTop: 12, fontSize: 12, color: "#38bdf8", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>
          {showAll ? "Show less" : `+ ${items.length - 60} more`}
        </button>
      )}
    </div>
  );
}

// ─── Result pane ──────────────────────────────────────────────────────────────
function ResultPane({ data }: { data: any }) {
  const count = getCount(data);
  if (!data || count === 0) {
    return (
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:160,gap:12,color:"#4b6490" }}>
        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
        <span style={{ fontSize: 13 }}>No data detected for this category</span>
      </div>
    );
  }

  if (Array.isArray(data) && data.every(d => typeof d === "string")) {
    return (
      <div>
        <p style={{ fontSize:12,color:"rgba(147,197,253,.5)",marginBottom:14 }}>
          Found <strong style={{color:"#93c5fd"}}>{count}</strong> entries
        </p>
        <TagList items={data} />
      </div>
    );
  }

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
    const keys = Array.from(new Set(data.flatMap((r: any) => Object.keys(r || {}))));
    return (
      <div>
        <p style={{ fontSize:12,color:"rgba(147,197,253,.5)",marginBottom:14 }}>
          <strong style={{color:"#93c5fd"}}>{count}</strong> records
        </p>
        <div style={{ overflowX:"auto",borderRadius:12,border:"1px solid rgba(255,255,255,.06)" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,.08)" }}>
                {keys.map(k => <th key={k} style={{ padding:"10px 16px",textAlign:"left",fontWeight:600,color:"rgba(147,197,253,.8)",background:"rgba(56,189,248,.06)",whiteSpace:"nowrap" }}>{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, i: number) => (
                <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,.04)",background: i%2?"rgba(56,189,248,.025)":"transparent" }}>
                  {keys.map(k => <td key={k} style={{ padding:"8px 16px",color:"#cbd5e1",fontFamily:"monospace",whiteSpace:"nowrap" }}>{String(row?.[k] ?? "—")}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <pre style={{
      background:"rgba(4,10,20,0.8)",borderRadius:12,padding:20,
      fontSize:11,lineHeight:1.7,color:"#7dd3fc",overflow:"auto",maxHeight:"50vh",
      border:"1px solid rgba(56,189,248,.08)",fontFamily:"monospace",margin:0,
    }}>{JSON.stringify(data, null, 2)}</pre>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [file, setFile]           = useState<File | null>(null);
  const [dragging, setDragging]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [pStep, setPStep]         = useState(0);
  const [results, setResults]     = useState<Record<string, any> | null>(null);
  const [activeTab, setActiveTab] = useState("");
  const [error, setError]         = useState<string | null>(null);
  const fileRef                   = useRef<HTMLInputElement>(null);

  const acceptFile = useCallback((f: File) => {
    if (f.name.toLowerCase().endsWith(".dwg")) { setFile(f); setError(null); }
    else setError("Please select a valid .dwg file");
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files[0]) acceptFile(e.dataTransfer.files[0]);
  };

  const processFile = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResults(null); setPStep(1);
    const fd = new FormData(); fd.append("file", file);

    const step = (s: number, delay: number) =>
      new Promise<void>(r => setTimeout(() => { setPStep(s); r(); }, delay));

    try {
      const req = fetch("/api/upload", { method: "POST", body: fd });
      await step(1, 500);
      await step(2, 2200);
      await step(3, 4000);
      await step(4, 5500);
      const res = await req;
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Processing failed");
      setPStep(5);

      const map: Record<string, any> = {};
      if (Array.isArray(json.data)) {
        json.data.forEach((item: any) => {
          const k = (item.name as string).split("/").pop() || item.name;
          map[k] = item.data;
        });
      }
      setResults(map);
      const first = Object.keys(map)[0];
      if (first) setActiveTab(first);
    } catch (err: any) {
      setError(err.message); setPStep(0);
    } finally { setLoading(false); }
  };

  const totalEntries  = results ? Object.values(results).reduce((a,d)=>a+getCount(d),0) : 0;
  const nonEmptyCount = results ? Object.values(results).filter(d=>getCount(d)>0).length : 0;

  const STEPS = ["Convert DWG → JSON","Extract text entities","Clean & deduplicate","Run regex parsers"];

  return (
    <div style={S.page}>
      <div style={S.orb1} />
      <div style={S.orb2} />

      {/* Nav */}
      <nav style={S.nav}>
        <div style={S.navBrand}>
          <div style={S.navLogo}>S</div>
          <span style={S.navTitle}>
            Structural <span style={{ background:"linear-gradient(135deg,#38bdf8,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Extractor</span>
          </span>
        </div>
        <span style={S.navPill}>BBSteel AI Agent</span>
      </nav>

      {/* Main */}
      <div style={{ ...S.main, ...(results&&!loading?{justifyContent:"flex-start",paddingTop:32}:{}) }}>

        {/* ── Upload ── */}
        {!results && !loading && (
          <div style={S.card}>
            <h1 style={S.heading}>
              Upload <span style={S.headingAccent}>DWG File</span>
            </h1>
            <p style={S.subText}>Drop your AutoCAD drawing — we'll extract beams, columns, footings, rebar spacing and more.</p>

            <div
              style={S.dropZone(dragging, !!file)}
              onDragOver={e=>{e.preventDefault();setDragging(true);}}
              onDragLeave={()=>setDragging(false)}
              onDrop={handleDrop}
              onClick={()=>fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".dwg" style={{display:"none"}} onChange={e=>e.target.files?.[0]&&acceptFile(e.target.files[0])} />

              {file ? (
                <>
                  <div style={S.iconBox("#2dd4bf")}>
                    <svg width="22" height="22" fill="none" stroke="#2dd4bf" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <div>
                    <div style={{fontWeight:700,color:"#5eead4",fontSize:14}}>{file.name}</div>
                    <div style={{fontSize:12,color:"#4b6490",marginTop:4}}>{(file.size/1024/1024).toFixed(2)} MB • AutoCAD DWG</div>
                  </div>
                  <div style={{fontSize:12,color:"#4b6490"}}>Click to replace</div>
                </>
              ) : (
                <>
                  <div style={S.iconBox("#38bdf8")}>
                    <svg width="22" height="22" fill="none" stroke="#38bdf8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  </div>
                  <div style={{fontWeight:600,fontSize:14,color:"#c7d9f0"}}>Drag & drop your .dwg file</div>
                  <div style={{fontSize:12,color:"#4b6490"}}>or click to browse</div>
                </>
              )}
            </div>

            {error && (
              <div style={S.errorBox}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {error}
              </div>
            )}

            <button style={S.primaryBtn(!file)} onClick={processFile} disabled={!file}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Process Data
            </button>

            <div style={S.divider} />
            <div style={S.stepsTitle}>Pipeline steps</div>
            {STEPS.map((label,i) => (
              <div key={i} style={S.stepRow}>
                <div style={S.stepNum}>{i+1}</div>
                <div style={S.stepLabel}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div style={S.card}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",marginBottom:28}}>
              <div style={{position:"relative",width:60,height:60,marginBottom:20}}>
                <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid rgba(56,189,248,.15)"}} />
                <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid transparent",borderTopColor:"#38bdf8",animation:"spin 1s linear infinite"}} />
                <div style={{position:"absolute",inset:6,borderRadius:"50%",background:"rgba(56,189,248,.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="18" height="18" fill="none" stroke="#38bdf8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
              </div>
              <div style={{fontWeight:700,fontSize:20,marginBottom:6}}>Processing DWG</div>
              <div style={{fontSize:13,color:"#4b6490"}}>{file?.name}</div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {STEPS.map((label,i) => {
                const status = pStep > i+1 ? "done" : pStep === i+1 ? "active" : "idle";
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{
                      width:28,height:28,borderRadius:"50%",flexShrink:0,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:11,fontWeight:700,
                      border: status==="done" ? "1px solid #2dd4bf" : status==="active" ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,.1)",
                      background: status==="done" ? "rgba(45,212,191,.15)" : status==="active" ? "rgba(56,189,248,.15)" : "rgba(255,255,255,.04)",
                      color: status==="done" ? "#2dd4bf" : status==="active" ? "#38bdf8" : "#4b6490",
                      transition: "all .4s ease",
                    }}>{status==="done" ? "✓" : i+1}</div>
                    <span style={{fontSize:13,color: status==="done"?"#5eead4":status==="active"?"#bae6fd":"#4b6490",fontWeight:status==="active"?600:400,transition:"all .4s ease"}}>{label}</span>
                    {status==="active" && (
                      <div style={{marginLeft:"auto",width:14,height:14,borderRadius:"50%",border:"2px solid transparent",borderTopColor:"#38bdf8",animation:"spin 1s linear infinite"}} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {results && !loading && (
          <div style={{width:"100%",maxWidth:1280}}>
            {/* Stat bar */}
            <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:20}}>
              {[
                ["Total Entries", totalEntries.toLocaleString()],
                ["Categories", Object.keys(results).length],
                ["With Data", nonEmptyCount],
              ].map(([label, val]) => (
                <div key={label as string} style={{ padding:"14px 22px",borderRadius:14,background:"rgba(13,24,41,.75)",border:"1px solid rgba(56,189,248,.1)",flex:"1 1 100px",minWidth:100 }}>
                  <div style={{fontSize:11,color:"#4b6490",marginBottom:4}}>{label}</div>
                  <div style={{fontSize:24,fontWeight:800,background:"linear-gradient(135deg,#38bdf8,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{val}</div>
                </div>
              ))}
              <div style={{ padding:"14px 22px",borderRadius:14,background:"rgba(13,24,41,.75)",border:"1px solid rgba(56,189,248,.1)",flex:"2 1 160px",minWidth:160 }}>
                <div style={{fontSize:11,color:"#4b6490",marginBottom:4}}>Source File</div>
                <div style={{fontSize:13,fontWeight:600,color:"#c7d9f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{file?.name}</div>
              </div>
              <button onClick={()=>{setResults(null);setFile(null);setPStep(0);}}
                style={{ padding:"14px 22px",borderRadius:14,background:"rgba(13,24,41,.75)",border:"1px solid rgba(56,189,248,.1)",display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#4b6490",cursor:"pointer",fontFamily:"inherit",transition:"color .2s" }}
                onMouseEnter={e=>(e.currentTarget.style.color="#38bdf8")}
                onMouseLeave={e=>(e.currentTarget.style.color="#4b6490")}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                New File
              </button>
            </div>

            {/* Content */}
            <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
              {/* Sidebar */}
              <div style={{ width:200,flexShrink:0,background:"rgba(13,24,41,.75)",backdropFilter:"blur(20px)",border:"1px solid rgba(56,189,248,.1)",borderRadius:18,padding:12,maxHeight:"68vh",overflowY:"auto" }}>
                <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".12em",color:"#2d3f5a",fontWeight:700,paddingLeft:4,marginBottom:10}}>Categories</div>
                {Object.keys(results).map(key => {
                  const cnt = getCount(results[key]);
                  const isActive = activeTab === key;
                  return (
                    <button key={key} onClick={()=>setActiveTab(key)} style={{
                      width:"100%",textAlign:"left",padding:"9px 12px",borderRadius:10,
                      border: isActive?"1px solid rgba(56,189,248,.3)":"1px solid transparent",
                      background: isActive?"rgba(56,189,248,.1)":"transparent",
                      color: isActive?"#7dd3fc": cnt===0?"#2d3f5a":"#8ba3c7",
                      cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",
                      fontSize:12,fontWeight: isActive?600:400,fontFamily:"inherit",
                      marginBottom:2,transition:"all .2s",
                    }}>
                      <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{getMeta(key).label}</span>
                      <span style={{ background: isActive?"rgba(56,189,248,.2)":"rgba(255,255,255,.06)",color: isActive?"#38bdf8":"#4b6490",fontSize:10,padding:"2px 7px",borderRadius:99,minWidth:26,textAlign:"center",marginLeft:6,flexShrink:0 }}>{cnt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detail pane */}
              <div style={{ flex:1,background:"rgba(13,24,41,.75)",backdropFilter:"blur(20px)",border:"1px solid rgba(56,189,248,.1)",borderRadius:18,padding:28,minHeight:"68vh" }}>
                {activeTab && (
                  <>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
                      <span style={{fontSize:28}}>{getMeta(activeTab).icon}</span>
                      <div>
                        <h2 style={{fontSize:20,fontWeight:800,color:"#f0f6ff",margin:0}}>{getMeta(activeTab).label}</h2>
                        <p style={{fontSize:12,color:"#4b6490",margin:"4px 0 0"}}>{getCount(results[activeTab])} items extracted</p>
                      </div>
                    </div>
                    <ResultPane data={results[activeTab]} />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: rgba(6,13,26,0.8); }
        ::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 3px; }
      `}</style>
    </div>
  );
}
