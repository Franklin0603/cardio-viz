"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AboutPage() {
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
            <Link key={h} href={h} style={{ textDecoration: "none", color: h === "/about-us" ? "#2563eb" : "#4a5568", fontSize: 15, fontWeight: h === "/about-us" ? 500 : 400 }}>{l}</Link>
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
      <section style={{ padding: "160px 80px 80px", textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "rgba(37,99,235,0.09)", borderRadius: 50, padding: "6px 18px", marginBottom: 24, border: "1px solid rgba(37,99,235,0.16)" }}>
          <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>Our Mission</span>
        </div>
        <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: "clamp(40px,5vw,62px)", color: "#0a1628", lineHeight: 1.08, letterSpacing: "0.01em", marginBottom: 24 }}>
          Making Cardiac Data<br /><span style={{ color: "#2563eb" }}>Human-Readable</span>
        </h1>
        <p style={{ fontSize: 18, color: "#4a5568", lineHeight: 1.8, fontWeight: 300 }}>
          CardioViz was built on a simple belief: patients deserve to understand their own hearts. EKG reports are dense, technical, and intimidating — we use AI to change that.
        </p>
      </section>

      {/* MISSION */}
      <section style={{ padding: "20px 80px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 60, alignItems: "center", marginBottom: 80 }}>
          <div>
            <h2 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 36, color: "#0a1628", marginBottom: 20, letterSpacing: "0.01em" }}>Why We Built This</h2>
            <p style={{ fontSize: 16, color: "#4a5568", lineHeight: 1.8, marginBottom: 20, fontWeight: 300 }}>
              Every year, millions of people receive EKG reports they don't understand. The document sits in a folder, the numbers mean nothing, and the patient leaves their appointment more confused than when they arrived.
            </p>
            <p style={{ fontSize: 16, color: "#4a5568", lineHeight: 1.8, fontWeight: 300 }}>
              CardioViz bridges that gap. Upload your report, and in seconds you see your heart beating at your exact rate, labeled in 3D, with every finding explained in plain English — powered by Claude AI.
            </p>
          </div>
          <div style={{ background: "#fef2f2", borderRadius: 28, padding: "48px", textAlign: "center", border: "1px solid rgba(229,62,62,0.1)" }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>🫀</div>
            <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 48, color: "#e53e3e", marginBottom: 8 }}>10K+</div>
            <div style={{ fontSize: 16, color: "#4a5568" }}>EKGs decoded and understood</div>
          </div>
        </div>

        {/* Values */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {[
            { icon: "🔍", title: "Transparency", desc: "We show you the raw numbers AND explain what they mean. No black box — you see every interval, every finding, every flag.", color: "#eff6ff", accent: "#2563eb" },
            { icon: "🔒", title: "Privacy First", desc: "Your medical data is yours. We never store, log, or share your EKG data. The API key never leaves the server.", color: "#f0fdf4", accent: "#10b981" },
            { icon: "🌍", title: "Accessibility", desc: "Healthcare information should be accessible to everyone — not just those who went to medical school. Plain English, always.", color: "#faf5ff", accent: "#7c3aed" },
          ].map(v => (
            <div key={v.title} style={{ background: v.color, borderRadius: 24, padding: "34px 30px", border: "1px solid rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 36, marginBottom: 18 }}>{v.icon}</div>
              <h3 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 20, color: "#0a1628", marginBottom: 12 }}>{v.title}</h3>
              <p style={{ fontSize: 14, color: "#4a5568", lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section style={{ background: "#0a1628", padding: "80px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 40, color: "white", marginBottom: 16, letterSpacing: "0.01em" }}>Built With</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 60 }}>Production-grade technology stack for reliability and performance</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {[
              { name: "Next.js 14", desc: "React framework", icon: "▲" },
              { name: "Claude AI", desc: "PDF analysis", icon: "✦" },
              { name: "Three.js", desc: "3D rendering", icon: "◈" },
              { name: "TypeScript", desc: "Type safety", icon: "⟨⟩" },
            ].map(t => (
              <div key={t.name} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "28px 20px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 12, color: "#2563eb" }}>{t.icon}</div>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 16, color: "white", marginBottom: 6 }}>{t.name}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 40, color: "#0a1628", marginBottom: 16, letterSpacing: "0.01em" }}>Start Understanding Your Heart</h2>
        <p style={{ fontSize: 16, color: "#4a5568", marginBottom: 36 }}>Free to use. No account required. Just upload your EKG.</p>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <button style={{ background: "#0a1628", color: "white", border: "none", borderRadius: 50, padding: "17px 42px", fontSize: 16, fontWeight: 500, boxShadow: "0 8px 28px rgba(10,22,40,0.22)", display: "inline-flex", alignItems: "center", gap: 12, transition: "all 0.25s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#2563eb"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#0a1628"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            Try CardioViz Free
            <span style={{ background: "#2563eb", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>→</span>
          </button>
        </Link>
      </section>

      <footer style={{ background: "#060c18", padding: "40px 80px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🫀</span>
          <span style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: 16, color: "rgba(255,255,255,0.6)" }}>CardioViz</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {([["Home", "/"], ["Dashboard", "/dashboard"], ["How It Works", "/how-it-works"]] as const).map(([l, h]) => (
            <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: 14 }}>{l}</Link>
          ))}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© 2025 CardioViz</div>
      </footer>
    </div>
  );
}
