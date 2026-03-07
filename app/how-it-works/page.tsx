"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HowItWorksPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [isMobile, setIsMobile]   = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #eef3fb 0%, #f5f8ff 50%, #e8f0fe 100%)" }}>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: isMobile ? "0 20px" : "0 60px", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(255,255,255,0.88)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none", transition: "all 0.35s" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🫀</div>
          <span style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 19, color: "#0a1628" }}>Cardio<span style={{ color: "#2563eb" }}>Viz</span></span>
        </Link>
        <div style={{ display: "flex", gap: 40 }}>
          {([["About Us", "/about-us"], ["How It Works", "/how-it-works"], ["Dashboard", "/dashboard"]] as const).map(([l, h]) => (
            <Link key={h} href={h} style={{ textDecoration: "none", color: h === "/how-it-works" ? "#2563eb" : "#4a5568", fontSize: 15, fontWeight: h === "/how-it-works" ? 500 : 400 }}>{l}</Link>
          ))}
        </div>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <button style={{ background: "#0a1628", color: "#fff", border: "none", borderRadius: 50, padding: "11px 26px", fontSize: 14, fontWeight: 500 }}>Try Free →</button>
        </Link>
      </nav>


      {/* MOBILE MENU */}
      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, zIndex:999, background:"rgba(10,22,40,0.97)", backdropFilter:"blur(20px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:32, transform: menuOpen ? "translateX(0)" : "translateX(100%)", transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
        <button onClick={() => setMenuOpen(false)} style={{ position:"absolute", top:20, right:20, background:"none", border:"none", color:"white", fontSize:32, cursor:"pointer" }}>✕</button>
        {([["About Us", "/about-us"], ["How It Works", "/how-it-works"], ["Dashboard", "/dashboard"]] as const).map(([label, href]) => (
          <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{ fontFamily:"Bebas Neue,sans-serif", fontSize:42, color:"white", textDecoration:"none", letterSpacing:"0.02em" }}>{label}</Link>
        ))}
        <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ textDecoration:"none", marginTop:16 }}>
          <button style={{ background:"#2563eb", color:"white", border:"none", borderRadius:50, padding:"14px 36px", fontSize:16, fontWeight:600 }}>Try Free →</button>
        </Link>
      </div>
      {/* HERO */}
      <section style={{ padding: "160px 80px 80px", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "rgba(37,99,235,0.09)", borderRadius: 50, padding: "6px 18px", marginBottom: 24, border: "1px solid rgba(37,99,235,0.16)" }}>
          <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>Simple 3-Step Process</span>
        </div>
        <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: "clamp(40px,5vw,64px)", color: "#0a1628", lineHeight: 1.08, letterSpacing: "0.01em", marginBottom: 20 }}>
          From PDF to<br /><span style={{ color: "#2563eb" }}>3D Heartbeat</span> in Seconds
        </h1>
        <p style={{ fontSize: 18, color: "#4a5568", lineHeight: 1.75, fontWeight: 300 }}>
          No medical degree required. CardioViz turns your doctor's EKG report into a live, interactive visualization anyone can understand.
        </p>
      </section>

      {/* STEPS */}
      <section style={{ padding: "20px 80px 100px", maxWidth: 1100, margin: "0 auto" }}>
        {[
          { step: "01", icon: "📄", title: "Upload Your EKG PDF", color: "#eff6ff", accent: "#2563eb",
            desc: "Drag and drop — or click to browse — your EKG report PDF. This is the document your doctor or cardiologist gives you after an electrocardiogram test. Any standard 12-lead ECG report from any hospital or clinic works.",
            details: ["Works with any hospital PDF format", "Drag & drop or click to select", "File never stored — analyzed and discarded", "Supports reports from US, UK, and international formats"] },
          { step: "02", icon: "🤖", title: "Claude AI Reads the Report", color: "#f0fdf4", accent: "#10b981",
            desc: "Your PDF is sent securely to our server where Claude AI — Anthropic's advanced model — reads the full report, including scanned images of waveforms. It extracts every piece of data with near-perfect accuracy.",
            details: ["Extracts BPM, rhythm type, electrical axis", "Reads all 5 intervals: PR, QRS, QT, QTc, RR", "Identifies and lists clinical findings", "Writes a plain-English summary just for you"] },
          { step: "03", icon: "🫀", title: "Watch Your Heart Come Alive", color: "#fef2f2", accent: "#e53e3e",
            desc: "The dashboard launches with your personal data loaded. Your actual heart rate drives the 3D animation. The waveform shape adapts to your rhythm type. Every number is color-coded normal, borderline, or abnormal.",
            details: ["3D heart beats at your exact BPM", "Live scrolling EKG strip — 6 rhythm types", "Click to switch: abstract → body → anatomical", "Stats panel with all intervals and findings"] },
        ].map((s, i) => (
          <div key={s.step} style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr", gap: 60, marginBottom: 80, alignItems: "center" }}>
            {/* Content */}
            <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
              <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 80, fontWeight: 800, color: "rgba(37,99,235,0.08)", lineHeight: 1, marginBottom: -20 }}>{s.step}</div>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
              <h2 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 32, color: "#0a1628", marginBottom: 16, letterSpacing: "0.01em" }}>{s.title}</h2>
              <p style={{ fontSize: 16, color: "#4a5568", lineHeight: 1.75, marginBottom: 28, fontWeight: 300 }}>{s.desc}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {s.details.map(d => (
                  <li key={d} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#4a5568" }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: s.color, border: `1.5px solid ${s.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: s.accent, flexShrink: 0 }}>✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            {/* Visual card */}
            <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
              <div style={{ background: s.color, borderRadius: 28, padding: "48px 40px", border: `1px solid ${s.accent}18`, boxShadow: "0 20px 60px rgba(0,0,0,0.06)", textAlign: "center", minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
                <div style={{ fontSize: 80 }}>{s.icon}</div>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 18, color: "#0a1628" }}>Step {s.step}</div>
                <div style={{ fontSize: 14, color: "#4a5568" }}>{s.title}</div>
                <div style={{ width: 60, height: 3, background: `linear-gradient(90deg, ${s.accent}, transparent)`, borderRadius: 2 }} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section style={{ background: "#0a1628", padding: "80px", maxWidth: "100%" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 40, color: "white", textAlign: "center", marginBottom: 56, letterSpacing: "0.01em" }}>Common Questions</h2>
          {[
            { q: "Do I need to be a doctor to use CardioViz?", a: "Not at all. The AI summary is written in plain English specifically for patients. The color-coded indicators (green/yellow/red) make it immediately clear what's normal and what needs attention." },
            { q: "What kind of EKG reports does it accept?", a: "Any standard PDF EKG or ECG report from a hospital, clinic, or cardiologist office. 12-lead reports are ideal but single-lead reports work too." },
            { q: "Is my medical data safe?", a: "Your PDF is converted to text in your browser, sent once to our server for AI analysis, and immediately discarded. Nothing is stored, logged, or shared. Your API key never touches the browser." },
            { q: "Where can I get an EKG report to test with?", a: "Ask your doctor for a copy after your next physical — you have a legal right to your records. You can also download sample reports from PhysioNet (physionet.org) or use one of our 5 built-in demo cases." },
          ].map(faq => (
            <div key={faq.q} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "28px 0" }}>
              <h3 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 17, color: "white", marginBottom: 12 }}>{faq.q}</h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px", textAlign: "center", background: "linear-gradient(145deg, #eef3fb 0%, #f5f8ff 100%)" }}>
        <h2 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 40, color: "#0a1628", marginBottom: 16, letterSpacing: "0.01em" }}>Ready to See Your Heart?</h2>
        <p style={{ fontSize: 16, color: "#4a5568", marginBottom: 36 }}>Upload your EKG or try a demo case — no account needed.</p>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <button style={{ background: "#0a1628", color: "white", border: "none", borderRadius: 50, padding: "17px 42px", fontSize: 16, fontWeight: 500, boxShadow: "0 8px 28px rgba(10,22,40,0.22)", transition: "all 0.25s", display: "inline-flex", alignItems: "center", gap: 12 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#2563eb"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#0a1628"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            Analyze My EKG Now
            <span style={{ background: "#2563eb", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>→</span>
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#060c18", padding: "40px 80px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🫀</span>
          <span style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 16, color: "rgba(255,255,255,0.6)" }}>CardioViz</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {([["Home", "/"], ["Dashboard", "/dashboard"], ["About Us", "/about-us"]] as const).map(([l, h]) => (
            <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: 14 }}>{l}</Link>
          ))}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© 2025 CardioViz</div>
      </footer>
    </div>
  );
}
