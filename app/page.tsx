"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const heartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const el = heartRef.current;
    if (!el || isMobile) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 20;
      const dy = (e.clientY / window.innerHeight - 0.5) * 14;
      el.style.transform = `rotate(-8deg) translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #eef3fb 0%, #f5f8ff 40%, #e8f0fe 100%)" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: isMobile ? "0 20px" : "0 60px", height: 70,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(255,255,255,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
        transition: "all 0.35s",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>🫀</div>
          <span style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 19, color: "#0a1628" }}>Cardio<span style={{ color: "#2563eb" }}>Viz</span></span>
        </Link>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            {([["About Us", "/about-us"], ["How It Works", "/how-it-works"], ["Dashboard", "/dashboard"]] as const).map(([label, href]) => (
              <Link key={href} href={href} style={{ textDecoration: "none", color: "#4a5568", fontSize: 15, fontWeight: 400, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#2563eb")}
                onMouseLeave={e => (e.currentTarget.style.color = "#4a5568")}
              >{label}</Link>
            ))}
          </div>
        )}

        {/* Desktop CTA / Mobile hamburger */}
        {isMobile ? (
          <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ display: "block", width: 24, height: 2, background: "#0a1628", borderRadius: 2 }} />
            <span style={{ display: "block", width: 24, height: 2, background: "#0a1628", borderRadius: 2 }} />
            <span style={{ display: "block", width: 18, height: 2, background: "#0a1628", borderRadius: 2 }} />
          </button>
        ) : (
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <button style={{ background: "#0a1628", color: "#fff", border: "none", borderRadius: 50, padding: "11px 26px", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(10,22,40,0.22)", transition: "all 0.22s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#2563eb"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#0a1628"; }}
            >Try Free <span style={{ background: "rgba(255,255,255,0.18)", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>→</span></button>
          </Link>
        )}
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, background: "rgba(10,22,40,0.97)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, transform: menuOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
        <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "white", fontSize: 32, cursor: "pointer", lineHeight: 1 }}>✕</button>
        {([["About Us", "/about-us"], ["How It Works", "/how-it-works"], ["Dashboard", "/dashboard"]] as const).map(([label, href]) => (
          <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 42, color: "white", textDecoration: "none", letterSpacing: "0.02em" }}>{label}</Link>
        ))}
        <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", marginTop: 16 }}>
          <button style={{ background: "#2563eb", color: "white", border: "none", borderRadius: 50, padding: "14px 36px", fontSize: 16, fontWeight: 600 }}>Try Free →</button>
        </Link>
      </div>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: isMobile ? "100px 24px 60px" : "100px 80px 60px", flexDirection: isMobile ? "column" : "row", position: "relative", overflow: "hidden", gap: isMobile ? 40 : 0 }}>
        <div style={{ position: "absolute", top: "8%", right: "8%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* LEFT */}
        <div style={{ flex: 1, maxWidth: isMobile ? "100%" : 560, zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.09)", borderRadius: 50, padding: "6px 16px 6px 8px", marginBottom: 32, border: "1px solid rgba(37,99,235,0.18)" }}>
            <span style={{ background: "#2563eb", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white" }}>✦</span>
            <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>AI-Powered Cardiac Analysis</span>
          </div>

          <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: isMobile ? "clamp(56px,14vw,80px)" : "clamp(72px,8vw,110px)", lineHeight: 0.95, color: "#0a1628", marginBottom: 24, letterSpacing: "0.01em" }}>
            Your Heart<br /><span style={{ color: "#2563eb" }}>Data,</span> Decoded<br />by AI
          </h1>

          <p style={{ fontSize: isMobile ? 16 : 18, color: "#4a5568", lineHeight: 1.75, marginBottom: 44, fontWeight: 300 }}>
            Upload your EKG report and watch your heart beat in real-time 3D — powered by Claude AI.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 44 }}>
            <div style={{ display: "flex" }}>
              {["#4a90d9","#e8734a","#5cb85c"].map((c, i) => (
                <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${c}, ${c}99)`, border: "2.5px solid white", marginLeft: i > 0 ? -12 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{["👨‍⚕️","👩","👨"][i]}</div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 18, color: "#0a1628" }}>+10K</div>
              <div style={{ fontSize: 12, color: "#718096", letterSpacing: "0.08em" }}>PATIENTS ANALYZED</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button style={{ background: "#0a1628", color: "white", border: "none", borderRadius: 50, padding: isMobile ? "14px 24px" : "16px 32px", fontSize: isMobile ? 14 : 16, fontWeight: 500, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 28px rgba(10,22,40,0.25)", transition: "all 0.25s" }}>
                Analyze My EKG <span style={{ background: "#2563eb", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>→</span>
              </button>
            </Link>
            <Link href="/how-it-works" style={{ textDecoration: "none" }}>
              <button style={{ background: "transparent", color: "#4a5568", border: "1.5px solid rgba(0,0,0,0.14)", borderRadius: 50, padding: isMobile ? "14px 20px" : "16px 28px", fontSize: isMobile ? 13 : 15, fontWeight: 400, transition: "all 0.2s" }}>How It Works</button>
            </Link>
          </div>
        </div>

        {/* RIGHT — heart */}
        <div style={{ flex: 1, position: "relative", height: isMobile ? 300 : 640, display: "flex", alignItems: "center", justifyContent: "center", width: isMobile ? "100%" : "auto" }}>
          <div ref={heartRef} style={{
            width: isMobile ? 220 : 440, height: isMobile ? 220 : 440,
            background: "radial-gradient(ellipse at 38% 35%, #c8253a 0%, #8a0f20 40%, #3d0008 100%)",
            borderRadius: "44% 56% 62% 38% / 42% 38% 62% 58%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: isMobile ? 90 : 180,
            boxShadow: "0 40px 100px rgba(160,15,35,0.4)",
            animation: "heartbeat 0.85s ease-in-out infinite, floatHeart 4s ease-in-out infinite",
            transform: "rotate(-8deg)",
            transition: "transform 0.18s ease-out",
            position: "relative", overflow: "hidden", userSelect: "none",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 32% 28%, rgba(255,130,110,0.22) 0%, transparent 55%)", borderRadius: "inherit" }} />
            <span style={{ position: "relative", zIndex: 2 }}>🫀</span>
          </div>

          {/* Floating cards — hide on small mobile */}
          {!isMobile && <>
            <div style={{ position: "absolute", left: 0, top: "22%", background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)", borderRadius: 20, padding: "22px 26px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.9)", animation: "floatCard1 3.5s ease-in-out infinite", minWidth: 190 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", boxShadow: "0 0 8px #2563eb" }} /><span style={{ fontSize: 11, color: "#718096", letterSpacing: "0.05em" }}>Biomarker Analysis</span></div>
              <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 24, color: "#0a1628", marginBottom: 3 }}>Real-time</div>
              <div style={{ fontSize: 13, color: "#718096" }}>cardiac insights</div>
              <div style={{ marginTop: 14, height: 3, background: "linear-gradient(90deg, #2563eb, transparent)", borderRadius: 2 }} />
            </div>
            <div style={{ position: "absolute", right: 0, bottom: "16%", background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)", borderRadius: 20, padding: "22px 26px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.9)", animation: "floatCard2 4s ease-in-out infinite", minWidth: 190 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} /><span style={{ fontSize: 11, color: "#718096", letterSpacing: "0.05em" }}>AI Summary</span></div>
              <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 24, color: "#0a1628", marginBottom: 3 }}>Decoded</div>
              <div style={{ fontSize: 13, color: "#718096" }}>in plain English</div>
              <div style={{ marginTop: 14, height: 3, background: "linear-gradient(90deg, #10b981, transparent)", borderRadius: 2 }} />
            </div>
            <div style={{ position: "absolute", top: "10%", right: "12%", background: "rgba(10,22,40,0.88)", backdropFilter: "blur(14px)", borderRadius: 50, padding: "9px 22px", display: "flex", alignItems: "center", gap: 10, animation: "floatCard1 2.8s ease-in-out infinite" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff4466", animation: "blink 0.85s ease infinite" }} />
              <span style={{ color: "white", fontSize: 15, fontWeight: 600, fontFamily: "Bebas Neue,sans-serif" }}>72 BPM</span>
              <span style={{ color: "rgba(255,255,255,0.38)", fontSize: 12 }}>Normal</span>
            </div>
          </>}

          {/* Mobile BPM pill — show always */}
          {isMobile && (
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(10,22,40,0.88)", backdropFilter: "blur(14px)", borderRadius: 50, padding: "8px 20px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff4466", animation: "blink 0.85s ease infinite" }} />
              <span style={{ color: "white", fontSize: 14, fontWeight: 600, fontFamily: "Bebas Neue,sans-serif" }}>72 BPM — Normal</span>
            </div>
          )}
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: "#0a1628", padding: isMobile ? "40px 24px" : "48px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 28 : 40, maxWidth: 1100, margin: "0 auto" }}>
          {[{ num:"10K+", label:"EKGs Analyzed", icon:"📊" }, { num:"99%", label:"AI Accuracy", icon:"🎯" }, { num:"<10s", label:"Analysis Time", icon:"⚡" }, { num:"6", label:"Rhythm Types", icon:"🫀" }].map(item => (
            <div key={item.num} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 800, fontSize: isMobile ? 30 : 38, color: "white", marginBottom: 4 }}>{item.num}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: isMobile ? "60px 0 80px" : "100px 0 120px", background: "white", overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: 56, padding: isMobile ? "0 24px" : "0 80px" }}>
          <div style={{ display: "inline-block", background: "rgba(37,99,235,0.09)", borderRadius: 50, padding: "6px 18px", marginBottom: 20, border: "1px solid rgba(37,99,235,0.16)" }}>
            <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>What CardioViz Does</span>
          </div>
          <h2 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: isMobile ? "clamp(40px,10vw,60px)" : "clamp(52px,6vw,80px)", color: "#0a1628", lineHeight: 0.95, letterSpacing: "0.01em", maxWidth: 700, margin: "0 auto 16px" }}>
            Designed to Deliver<br />Clarity and Trust
          </h2>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: isMobile ? "stretch" : "flex-start", padding: isMobile ? "0 16px 16px" : "0 60px 20px", overflowX: isMobile ? "auto" : "auto", flexDirection: isMobile ? "column" : "row" }}>
          {[
            { bg: "#0d1117", mt: 0,  dark: true,  icon: "🫀", title: "Early detection of health risks",          desc: "Spot cardiac issues before they become serious." },
            { bg: "linear-gradient(160deg,#5c1a2a,#2d0e40,#1a1050)", mt: isMobile ? 0 : 60, dark: true,  icon: "🤖", title: "AI-powered interpretation (no doctor-speak)", desc: "Get clear insights without medical jargon." },
            { bg: "linear-gradient(145deg,#b8d4ee,#96b8e0,#7aa0cc)", mt: isMobile ? 0 : 20, dark: false, icon: "📈", title: "Live EKG Strip, beat-by-beat trace",           desc: "Stay on top of your cardiac rhythm in real time." },
            { bg: "#f0f4f8",         mt: isMobile ? 0 : 90, dark: false, icon: "📋", title: "Visual dashboards, alerts & smart reports",   desc: "Trends, alerts, and interval insights at a glance." },
          ].map((c, i) => (
            <div key={i} style={{ flex: isMobile ? "none" : "0 0 270px", width: isMobile ? "100%" : undefined, minHeight: isMobile ? 180 : 360, background: c.bg, borderRadius: 28, padding: "28px", display: "flex", flexDirection: isMobile ? "row" : "column", justifyContent: isMobile ? "flex-start" : "space-between", alignItems: isMobile ? "center" : undefined, gap: isMobile ? 16 : 0, marginTop: c.mt, transition: "transform 0.3s, box-shadow 0.3s" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: c.dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.6)", border: c.dark ? "1px solid rgba(255,255,255,0.15)" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
              <div>
                <h3 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 20, color: c.dark ? "white" : "#0a1628", lineHeight: 1.2, marginBottom: 8 }}>{c.title}</h3>
                <p style={{ fontSize: 13, color: c.dark ? "rgba(255,255,255,0.4)" : "#718096", lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "linear-gradient(160deg, #0d1628 0%, #0f1d35 50%, #0d1a30 100%)", padding: isMobile ? "70px 24px 80px" : "100px 80px 120px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", borderRadius: 50, padding: "8px 22px", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Simple Process</span>
            </div>
          </div>
          <h2 style={{ textAlign: "center", fontFamily: "Bebas Neue,sans-serif", fontSize: isMobile ? "clamp(52px,14vw,80px)" : "clamp(72px,10vw,130px)", color: "white", lineHeight: 0.92, marginBottom: isMobile ? 52 : 80 }}>
            From PDF to<br />3D in Seconds
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 40 : 0, position: "relative", marginBottom: 60 }}>
            {[
              { step:"01", icon:"📄", title:"Upload Your PDF", desc:"Drag and drop your EKG report from any doctor or hospital." },
              { step:"02", icon:"🤖", title:"AI Analyzes It",   desc:"Claude AI reads the report, extracts all data, and writes a plain-English summary." },
              { step:"03", icon:"🫀", title:"Watch It Live",    desc:"Your heart beats in 3D at your exact rate. Explore the live EKG strip and all stats." },
            ].map(s => (
              <div key={s.step} style={{ textAlign: "center", padding: "0 24px" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(30,50,100,0.9)", border: "2px solid rgba(37,99,235,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px", boxShadow: "0 0 0 8px rgba(37,99,235,0.06)" }}>{s.icon}</div>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 11, color: "rgba(100,140,220,0.7)", letterSpacing: "0.2em", marginBottom: 10 }}>{s.step}</div>
                <h3 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 20, color: "white", marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", lineHeight: 1.75, maxWidth: 240, margin: "0 auto" }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button style={{ background: "#2563eb", color: "white", border: "none", borderRadius: 50, padding: isMobile ? "16px 32px" : "20px 52px", fontSize: isMobile ? 15 : 18, fontWeight: 600, boxShadow: "0 8px 32px rgba(37,99,235,0.45)", display: "inline-flex", alignItems: "center", gap: 14 }}>
                Analyze My EKG Now <span style={{ background: "rgba(255,255,255,0.22)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CTA */}
      <section style={{ background: "linear-gradient(160deg, #e8eef8 0%, #dde6f4 100%)", padding: isMobile ? "80px 24px 0" : "120px 80px 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: isMobile ? "clamp(44px,12vw,72px)" : "clamp(60px,7vw,96px)", color: "#1a2540", lineHeight: 0.95, marginBottom: 20 }}>
            Your Cardiac Data,<br />Decoded by AI
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 17, color: "#6b7a9a", lineHeight: 1.75, marginBottom: 44, fontWeight: 300 }}>
            CardioViz helps you track, understand, and act on your EKG — with smart AI insights and a live 3D heartbeat.
          </p>
          <Link href="/dashboard" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)", borderRadius: 50, boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid rgba(255,255,255,0.9)", overflow: "hidden" }}>
              <span style={{ padding: isMobile ? "14px 24px" : "18px 32px", fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: isMobile ? 16 : 18, color: "#0a1628" }}>See Dashboard</span>
              <div style={{ width: isMobile ? 50 : 60, height: isMobile ? 50 : 60, borderRadius: "50%", background: "#4a90e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "6px 6px 6px 0", flexShrink: 0 }}>
                <span style={{ color: "white", fontSize: 20, transform: "rotate(-45deg)", display: "block" }}>↗</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "linear-gradient(160deg, #e8eef8 0%, #dde6f4 100%)", padding: isMobile ? "60px 24px 40px" : "80px 80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48, flexWrap: "wrap", gap: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 26 }}>🫀</span>
              <span style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 800, fontSize: 20, color: "#1a2540" }}>Cardio<span style={{ color: "#2563eb" }}>Viz</span></span>
            </div>
            <div style={{ display: "flex", gap: isMobile ? 40 : 80 }}>
              <div>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 15, color: "#1a2540", marginBottom: 16 }}>Links</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {([["About Us","/about-us"],["How It Works","/how-it-works"],["Dashboard","/dashboard"]] as const).map(([l,h]) => (
                    <Link key={l} href={h} style={{ color:"#6b7a9a", textDecoration:"none", fontSize:13 }}>{l}</Link>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 15, color: "#1a2540", marginBottom: 16 }}>Social</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[["𝕏 Twitter","#"],["📸 Instagram","#"],["💼 LinkedIn","#"]].map(([l,h]) => (
                    <a key={l} href={h} style={{ color:"#6b7a9a", textDecoration:"none", fontSize:13 }}>{l}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#9ca3af" }}>© CardioViz 2025 · All rights reserved</span>
            <a href="#" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>Privacy policy</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes heartbeat { 0%,100%{transform:scale(1) rotate(-8deg)} 14%{transform:scale(1.09) rotate(-8deg)} 28%{transform:scale(1.04) rotate(-8deg)} 42%{transform:scale(1.07) rotate(-8deg)} }
        @keyframes floatHeart { 0%,100%{margin-top:0} 50%{margin-top:-22px} }
        @keyframes floatCard1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes floatCard2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
      `}</style>
    </div>
  );
}
