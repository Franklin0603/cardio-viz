"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { EKGData } from "@/lib/types";
import { DEMO_CASES } from "@/lib/demoCases";

const HeartCanvas = dynamic(() => import("@/components/HeartCanvas"), { ssr: false });
const EKGStrip    = dynamic(() => import("@/components/EKGStrip"),    { ssr: false });

type Tab = "overview" | "trends";

// ── Upload modal ──────────────────────────────────────────────────────────────
function UploadModal({ onFile, onDemo, onClose }: {
  onFile: (f: File) => void;
  onDemo: (d: EKGData) => void;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,22,40,0.5)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: 28, padding: "40px", width: 520, boxShadow: "0 40px 100px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 22, color: "#0a1628" }}>Load EKG Report</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: "#718096", cursor: "pointer" }}>✕</button>
        </div>

        {/* Drop zone */}
        <div
          style={{ border: `2px dashed ${drag ? "#2563eb" : "rgba(0,0,0,0.12)"}`, borderRadius: 18, padding: "36px 24px", textAlign: "center", cursor: "pointer", background: drag ? "rgba(37,99,235,0.04)" : "#fafafa", transition: "all 0.2s", marginBottom: 24 }}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") onFile(f); }}
          onClick={() => inputRef.current?.click()}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
          <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 600, fontSize: 16, color: "#0a1628", marginBottom: 6 }}>Drop your EKG PDF here</div>
          <div style={{ fontSize: 13, color: "#718096" }}>or click to browse</div>
          <input ref={inputRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
          <span style={{ fontSize: 12, color: "#718096" }}>or try a demo</span>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DEMO_CASES.map(c => (
            <button key={c.id} onClick={() => onDemo(c.data)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 12, cursor: "pointer", transition: "all 0.18s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#2563eb33"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.06)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>🫀</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 600, fontSize: 13, color: "#0a1628" }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: "#718096" }}>{c.description}</div>
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: c.badgeColor, background: `${c.badgeColor}15`, padding: "3px 10px", borderRadius: 50 }}>{c.badge}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Gauge arc component ───────────────────────────────────────────────────────
function GaugeArc({ value, min, max, normal, label, unit }: { value: number | null; min: number; max: number; normal: boolean; label: string; unit: string }) {
  if (value == null) return null;
  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const angle = -140 + pct * 280;
  const color = normal ? "#10b981" : "#ef4444";

  return (
    <div style={{ background: "white", borderRadius: 20, padding: "24px 20px", textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: 12, color: "#718096", marginBottom: 12, letterSpacing: "0.04em" }}>{label}</div>
      <div style={{ position: "relative", width: 120, height: 72, margin: "0 auto 8px" }}>
        <svg viewBox="0 0 120 72" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          {/* Track */}
          <path d="M 12 66 A 54 54 0 0 1 108 66" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="8" strokeLinecap="round" />
          {/* Normal zone */}
          <path d="M 12 66 A 54 54 0 0 1 108 66" fill="none" stroke={`${color}22`} strokeWidth="8" strokeLinecap="round" />
          {/* Value arc */}
          <path d="M 12 66 A 54 54 0 0 1 108 66" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${pct * 169.6} 169.6`} />
          {/* Needle dot */}
          <circle cx={60 + 46 * Math.cos((angle - 90) * Math.PI / 180)} cy={66 + 46 * Math.sin((angle - 90) * Math.PI / 180)} r="5" fill={color} />
        </svg>
        <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 26, color: "#0a1628", whiteSpace: "nowrap" }}>{value}</div>
      </div>
      <div style={{ fontSize: 11, color: "#718096", marginTop: 16 }}>{unit}</div>
      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
        &lt; {min} &nbsp;—&nbsp; &gt; {max}
      </div>
    </div>
  );
}

// ── Live EKG TrendChart ──────────────────────────────────────────────────────
function TrendChart({ bpm, shape }: { bpm: number; shape: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const xRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width  = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    function gauss(x: number, mu: number, s: number) { return Math.exp(-0.5*((x-mu)/s)**2); }
    const sps = Math.round((60/bpm)*60);
    const beat: number[] = [];
    for (let i = 0; i < sps; i++) {
      const p = i/sps; let y = 0;
      if (shape === "afib") {
        y = (Math.random()-0.5)*0.06;
        if (p>0.35&&p<0.48) y += gauss(p,0.38,0.012)*0.85;
        if (p>0.42&&p<0.5)  y -= gauss(p,0.44,0.008)*0.22;
      } else if (shape === "tachycardia") {
        y += gauss(p,0.12,0.022)*0.16;
        if (p>0.3&&p<0.5)  y += gauss(p,0.38,0.018)*1.0;
        if (p>0.4&&p<0.55) y -= gauss(p,0.46,0.010)*0.22;
      } else if (shape === "bradycardia") {
        y += gauss(p,0.1,0.03)*0.2;
        if (p>0.4&&p<0.6)  y += gauss(p,0.47,0.02)*0.95;
        if (p>0.5&&p<0.65) y -= gauss(p,0.54,0.01)*0.18;
        if (p>0.62&&p<0.85) y += gauss(p,0.72,0.055)*0.28;
      } else if (shape === "heart_block") {
        if (p>0.06&&p<0.15) y += gauss(p,0.11,0.018)*0.18;
        if (p>0.48&&p<0.65) y += gauss(p,0.56,0.020)*0.88;
        if (p>0.58&&p<0.70) y -= gauss(p,0.63,0.010)*0.20;
        if (p>0.68&&p<0.88) y += gauss(p,0.78,0.045)*0.24;
      } else {
        y += gauss(p,0.12,0.025)*0.18;
        if (p>0.28&&p<0.36) y -= gauss(p,0.31,0.008)*0.12;
        if (p>0.30&&p<0.46) y += gauss(p,0.36,0.018)*0.95;
        if (p>0.38&&p<0.50) y -= gauss(p,0.43,0.010)*0.20;
        if (p>0.55&&p<0.82) y += gauss(p,0.67,0.048)*0.28;
      }
      beat.push(y);
    }
    const buf: number[] = [];
    for (let r=0; r<12; r++) buf.push(...beat);

    const SPEED = 2.5;
    const draw = () => {
      frameRef.current = requestAnimationFrame(draw);
      const imgData = ctx.getImageData(Math.ceil(SPEED*dpr), 0, Math.max(1,Math.floor((W-SPEED)*dpr)), Math.max(1,H*dpr));
      ctx.putImageData(imgData, 0, 0);
      ctx.clearRect(W-SPEED-2, 0, SPEED+3, H);
      for (let dx=0; dx<SPEED; dx++) {
        const idx = Math.floor(xRef.current) % buf.length;
        const nxt = (idx+1) % buf.length;
        const y0=buf[idx], y1=buf[nxt];
        const cy = H/2 - y0*(H*0.4);
        const ny = H/2 - y1*(H*0.4);
        const px = W-SPEED+dx;
        const isR = y0 > 0.35;
        ctx.beginPath(); ctx.moveTo(px,cy); ctx.lineTo(px+1,ny);
        ctx.strokeStyle = isR ? "#ef4444" : "#2563eb";
        ctx.lineWidth   = isR ? 2.2 : 1.6;
        ctx.shadowColor = isR ? "#ef4444" : "#3b82f6";
        ctx.shadowBlur  = isR ? 12 : 5;
        ctx.stroke();
        xRef.current++;
      }
    };
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [bpm, shape]);

  return <canvas ref={canvasRef} style={{ width:"100%", height:"100%", display:"block" }} />;
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [ekgData, setEkgData]     = useState<EKGData | null>(null);
  const [isDemo, setIsDemo]       = useState(false);
  const [tab, setTab]             = useState<Tab>("overview");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [loadMsg, setLoadMsg]     = useState("");
  const [progress, setProgress]   = useState(0);
  const [activeNav, setActiveNav] = useState("home");

  // Load AFib demo by default for showcase
  useEffect(() => {
    const afib = DEMO_CASES.find(c => c.id === "normal");
    if (afib) { setEkgData(afib.data); setIsDemo(true); }
  }, []);

  const handleFile = async (file: File) => {
    setShowModal(false);
    setLoading(true); setProgress(10); setLoadMsg("Reading PDF...");
    try {
      const base64 = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload  = () => res((r.result as string).split(",")[1]);
        r.onerror = () => rej(new Error("Failed"));
        r.readAsDataURL(file);
      });
      setProgress(40); setLoadMsg("Sending to AI...");
      const resp = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pdfBase64: base64 }) });
      setProgress(75); setLoadMsg("Parsing data...");
      if (!resp.ok) throw new Error("Analysis failed");
      const data: EKGData = await resp.json();
      setProgress(100); setLoadMsg("Done!");
      await new Promise(r => setTimeout(r, 300));
      setEkgData(data); setIsDemo(false);
    } catch (e: unknown) {
      alert("Error: " + (e instanceof Error ? e.message : "Unknown"));
    } finally {
      setLoading(false); setProgress(0);
    }
  };

  const handleDemo = (data: EKGData) => { setShowModal(false); setEkgData(data); setIsDemo(true); };

  const d = ekgData;
  const bpm = d?.vitals.heartRate ?? 72;
  const interp = d?.vitals.interpretation ?? "Normal";
  const interpColor = interp === "Normal" ? "#10b981" : interp === "Abnormal" ? "#ef4444" : "#f59e0b";

  const NAV_ITEMS = [
    { id: "home",    icon: "⌂",  label: "Dashboard" },
    { id: "heart",   icon: "♥",  label: "Heart" },
    { id: "dna",     icon: "⊕",  label: "Genetics" },
    { id: "dental",  icon: "◯",  label: "Dental" },
    { id: "charts",  icon: "▦",  label: "Reports" },
    { id: "settings",icon: "⚙",  label: "Settings" },
  ];

  return (
    <div style={{ height: "100vh", display: "flex", background: "#eef2f8", fontFamily: "'Outfit', sans-serif", overflow: "hidden" }}>

      {/* ── SIDE NAV ── */}
      <div style={{ width: 80, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", background: "transparent", gap: 4, flexShrink: 0, zIndex: 10 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", marginBottom: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🫀</div>
        </Link>

        {/* Nav pills */}
        <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 20, padding: "8px 6px", display: "flex", flexDirection: "column", gap: 2, backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)" }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              title={item.label}
              style={{ width: 48, height: 48, borderRadius: 14, border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", transition: "all 0.2s",
                background: activeNav === item.id ? "white" : "transparent",
                color: activeNav === item.id ? "#2563eb" : "#9ca3af",
                boxShadow: activeNav === item.id ? "0 2px 12px rgba(0,0,0,0.1)" : "none",
              }}
            >{item.icon}</button>
          ))}
        </div>

        {/* Bottom nav */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <button title="Back to Home" style={{ width: 44, height: 44, borderRadius: 12, border: "none", background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", color: "#9ca3af" }}>←</button>
          </Link>
          <div style={{ width: 44, height: 26, borderRadius: 13, background: "#2563eb", display: "flex", alignItems: "center", padding: "3px 3px 3px 22px", cursor: "pointer" }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🌙</div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

        {/* TOP BAR */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px 0", flexShrink: 0 }}>
          {/* Search */}
          <div style={{ flex: 1, maxWidth: 340, position: "relative" }}>
            <input placeholder="Search indicators, reports..." style={{ width: "100%", padding: "10px 16px 10px 40px", borderRadius: 50, border: "none", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", fontSize: 14, color: "#4a5568", outline: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }} />
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#9ca3af" }}>🔍</span>
          </div>

          {/* Icons + User */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ width: 40, height: 40, borderRadius: 12, border: "none", background: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 16 }}>📅</button>
            <button style={{ width: 40, height: 40, borderRadius: 12, border: "none", background: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 16 }}>🔔</button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.7)", borderRadius: 14, padding: "6px 14px 6px 6px", backdropFilter: "blur(12px)" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #4a90d9, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {d?.patient.name && d.patient.name !== "Unknown Patient" ? d.patient.name[0] : "👤"}
              </div>
              <div>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 13, color: "#0a1628" }}>{d?.patient.name && d.patient.name !== "Unknown Patient" ? d.patient.name : "Guest User"}</div>
                <div style={{ fontSize: 11, color: "#718096" }}>{d?.patient.age && d.patient.age !== "Unknown" ? `${d.patient.age} yrs` : "—"} · {d?.patient.gender && d.patient.gender !== "Unknown" ? d.patient.gender : "—"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* LEFT — 3D Heart */}
          <div style={{ width: "42%", position: "relative", flexShrink: 0 }}>
            {/* Loading overlay */}
            {loading && (
              <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(238,242,248,0.85)", backdropFilter: "blur(4px)", gap: 16 }}>
                <div style={{ fontSize: 48, animation: "heartPulse 0.85s ease infinite" }}>🫀</div>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 600, fontSize: 14, color: "#0a1628" }}>{loadMsg}</div>
                <div style={{ width: 200, height: 4, background: "rgba(0,0,0,0.08)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "linear-gradient(90deg, #2563eb, #60a5fa)", borderRadius: 2, width: `${progress}%`, transition: "width 0.4s ease" }} />
                </div>
              </div>
            )}

            {d && <HeartCanvas bpm={bpm} rhythm={d.vitals.rhythm ?? "—"} />}

            {/* Upload button */}
            <button onClick={() => setShowModal(true)} style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 50, padding: "10px 24px", fontSize: 13, fontWeight: 600, color: "#0a1628", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", transition: "all 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "white"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.88)"}
            >
              📂 {isDemo ? "Load Real EKG" : "Change Report"}
            </button>
          </div>

          {/* RIGHT — Data panel */}
          <div style={{ flex: 1, padding: "20px 28px 20px 0", overflow: "hidden", display: "flex", flexDirection: "column" }}>

            {/* Title + vitals row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                {isDemo && <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600, letterSpacing: "0.12em", marginBottom: 4 }}>DEMO MODE</div>}
                <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: "clamp(28px,3vw,44px)", color: "#0a1628", lineHeight: 1.1, letterSpacing: "0.01em" }}>
                  Cardiac<br />Dashboard
                </h1>
              </div>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {[
                  { label: "BPM", value: `${bpm}` },
                  { label: "Rhythm", value: d?.vitals.rhythm?.split(" ").slice(-1)[0] ?? "—", small: true },
                  { label: "Status", value: interp, color: interpColor },
                ].map(v => (
                  <div key={v.label} style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: v.small ? 16 : 24, color: (v as any).color ?? "#0a1628", lineHeight: 1.1 }}>{v.value}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", letterSpacing: "0.06em" }}>{v.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 18, background: "rgba(255,255,255,0.5)", borderRadius: 12, padding: 4, width: "fit-content" }}>
              {(["overview", "trends"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 22px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "Bebas Neue,sans-serif", fontWeight: t === tab ? 600 : 400, fontSize: 13, transition: "all 0.2s", background: t === tab ? "white" : "transparent", color: t === tab ? "#0a1628" : "#9ca3af", boxShadow: t === tab ? "0 2px 8px rgba(0,0,0,0.08)" : "none" }}>
                  {t === "overview" ? "Overview" : "EKG Trends"}
                </button>
              ))}
            </div>

            {/* ── TAB: OVERVIEW ── */}
            {tab === "overview" && d && (
              <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Gauge row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                  <GaugeArc value={d.intervals.PR.value} min={120} max={200} normal={d.intervals.PR.normal} label="PR Interval" unit="ms" />
                  <GaugeArc value={d.intervals.QRS.value} min={80} max={120} normal={d.intervals.QRS.normal} label="QRS Duration" unit="ms" />
                  <GaugeArc value={d.intervals.QTc.value} min={350} max={440} normal={d.intervals.QTc.normal} label="QTc Interval" unit="ms" />
                </div>

                {/* Indicators table */}
                <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.9)", flex: 1 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1fr", padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 12, color: "#9ca3af", fontWeight: 500, letterSpacing: "0.04em" }}>
                    <span>Indicator</span><span>Low</span><span style={{ textAlign: "center" }}>Result</span><span style={{ textAlign: "center" }}>High</span><span style={{ textAlign: "right" }}>Status</span>
                  </div>

                  {Object.entries(d.intervals).map(([key, obj]) => {
                    if (!obj || obj.value == null) return null;
                    const ranges: Record<string, [number, number]> = { PR:[120,200], QRS:[80,120], QT:[350,450], QTc:[350,440], RR:[600,1000] };
                    const [lo, hi] = ranges[key] ?? [0, 999];
                    const st = obj.normal === false ? "Abnormal" : "Normal";
                    const stColor = obj.normal === false ? "#ef4444" : "#10b981";
                    return (
                      <div key={key} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1fr", padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.04)", alignItems: "center", transition: "background 0.15s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(37,99,235,0.03)"}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                      >
                        <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 600, fontSize: 14, color: "#0a1628" }}>{key} Interval</div>
                        <div style={{ fontSize: 13, color: "#9ca3af" }}>&lt; {lo}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#0a1628", textAlign: "center" }}>{obj.value} <span style={{ fontSize: 11, fontWeight: 400, color: "#9ca3af" }}>ms</span></div>
                        <div style={{ fontSize: 13, color: "#9ca3af", textAlign: "center" }}>&gt; {hi}</div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: stColor, background: `${stColor}15`, padding: "3px 10px", borderRadius: 50 }}>{st}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Findings rows */}
                  {d.findings.slice(0, 3).map((f, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1fr", padding: "12px 20px", borderBottom: "1px solid rgba(0,0,0,0.04)", alignItems: "center" }}>
                      <div style={{ fontSize: 13, color: "#4a5568", gridColumn: "1 / 5" }}>› {f}</div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", background: "#6366f115", padding: "3px 10px", borderRadius: 50 }}>Finding</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB: TRENDS ── */}
            {tab === "trends" && d && (
              <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>

                {/* ── LIVE EKG STRIP ── */}
                <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px" }}>
                    <div>
                      <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 16, color: "#0a1628", letterSpacing: "0.04em" }}>HEART RATE</div>
                      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Live EKG Trace — Lead II</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "blink 0.85s ease infinite" }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#0a1628" }}>{bpm} bpm</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: interpColor, background: `${interpColor}15`, padding: "4px 12px", borderRadius: 50, border: `1px solid ${interpColor}30` }}>{interp}</span>
                    </div>
                  </div>
                  {/* Canvas strip — dark background, blue+red waveform */}
                  <div style={{ height: 120, background: "#f0f4ff", borderTop: "1px solid rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
                    {/* Subtle horizontal grid lines */}
                    {[0.25,0.5,0.75].map(p => (
                      <div key={p} style={{ position:"absolute", left:0, right:0, top:`${p*100}%`, height:1, background:"rgba(37,99,235,0.07)", pointerEvents:"none" }} />
                    ))}
                    <TrendChart bpm={bpm} shape={d.waveformShape ?? "normal_sinus"} />
                  </div>
                </div>

                {/* ── VITALS BLOCK ── */}
                <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                  <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 11, color: "#9ca3af", letterSpacing: "0.08em", fontWeight: 500 }}>VITALS</div>
                  {[
                    { label: "Heart Rate",      value: `${bpm} bpm`,          valueColor: "#0a1628" },
                    { label: "Rhythm",          value: d.vitals.rhythm ?? "—", valueColor: "#0a1628" },
                    { label: "Electrical Axis", value: d.vitals.axis ?? "—",   valueColor: "#0a1628" },
                    { label: "Interpretation",  value: interp,                 valueColor: interpColor },
                  ].map((row, i, arr) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 20px", borderBottom: i < arr.length-1 ? "1px solid rgba(0,0,0,0.04)" : "none", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(37,99,235,0.03)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                    >
                      <span style={{ fontSize: 13, color: "#718096" }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: row.valueColor, textAlign: "right", maxWidth: "60%" }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* ── INTERVALS TABLE ── */}
                <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", padding: "12px 20px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 11, color: "#9ca3af", letterSpacing: "0.08em", fontWeight: 500 }}>
                    <span>INTERVAL</span><span style={{ textAlign:"center" }}>VALUE (MS)</span><span style={{ textAlign:"center" }}>LOW</span><span style={{ textAlign:"center" }}>HIGH</span><span style={{ textAlign:"right" }}>STATUS</span>
                  </div>
                  {Object.entries(d.intervals).map(([key, obj]) => {
                    if (!obj || obj.value == null) return null;
                    const ranges: Record<string, [number, number]> = { PR:[120,200], QRS:[80,120], QT:[350,450], QTc:[350,440], RR:[600,1000] };
                    const [lo, hi] = ranges[key] ?? [0, 999];
                    const pct = Math.min(100, Math.max(0, ((obj.value - lo) / (hi - lo)) * 100));
                    const ok = obj.normal !== false;
                    const stColor = ok ? "#10b981" : "#ef4444";
                    return (
                      <div key={key} style={{ padding: "12px 20px 14px", borderBottom: "1px solid rgba(0,0,0,0.04)", transition: "background 0.15s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(37,99,235,0.03)"}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                      >
                        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 15, color: "#0a1628", letterSpacing: "0.04em" }}>{key}</span>
                          <span style={{ textAlign: "center", fontSize: 15, fontWeight: 700, color: "#0a1628" }}>{obj.value}</span>
                          <span style={{ textAlign: "center", fontSize: 12, color: "#9ca3af" }}>{lo}</span>
                          <span style={{ textAlign: "center", fontSize: 12, color: "#9ca3af" }}>{hi}</span>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: stColor, background: `${stColor}15`, padding: "3px 10px", borderRadius: 50, border: `1px solid ${stColor}25` }}>{ok ? "Normal" : "Abnormal"}</span>
                          </div>
                        </div>
                        <div style={{ height: 3, background: "rgba(0,0,0,0.06)", borderRadius: 2 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${stColor}80, ${stColor})`, borderRadius: 2, transition: "width 0.8s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── FINDINGS ── */}
                {d.findings && d.findings.length > 0 && (
                  <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                    <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 11, color: "#9ca3af", letterSpacing: "0.08em", fontWeight: 500 }}>FINDINGS</div>
                    <div style={{ padding: "8px 0" }}>
                      {d.findings.map((f, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 20px", borderBottom: i < d.findings.length-1 ? "1px solid rgba(0,0,0,0.04)" : "none", transition: "background 0.15s" }}
                          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(37,99,235,0.03)"}
                          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                        >
                          <span style={{ color: "#2563eb", fontSize: 14, flexShrink: 0, marginTop: 1 }}>›</span>
                          <span style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.6 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── AI SUMMARY ── */}
                {d.summary && (
                  <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                    <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15 }}>🤖</span>
                      <span style={{ fontSize: 11, color: "#2563eb", letterSpacing: "0.08em", fontWeight: 600 }}>AI SUMMARY</span>
                    </div>
                    <div style={{ padding: "16px 20px" }}>
                      <p style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.72 }}>{d.summary}</p>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && <UploadModal onFile={handleFile} onDemo={handleDemo} onClose={() => setShowModal(false)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&family=Share+Tech+Mono&display=swap');
        @keyframes heartPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        * { box-sizing: border-box; }
        body { background: #eef2f8 !important; overflow: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }
        @keyframes expand { 0%{width:80px;height:80px;opacity:0.6} 100%{width:300px;height:300px;opacity:0} }
        @keyframes fadeInLabel { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
