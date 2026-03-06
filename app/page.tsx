"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const heartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = heartRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 20;
      const dy = (e.clientY / window.innerHeight - 0.5) * 14;
      el.style.transform = `rotate(-8deg) translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #eef3fb 0%, #f5f8ff 40%, #e8f0fe 100%)" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 60px", height: 70,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(255,255,255,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
        transition: "all 0.35s",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>🫀</div>
          <span style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 19, color: "#0a1628" }}>
            Cardio<span style={{ color: "#2563eb" }}>Viz</span>
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {([["About Us", "/about-us"], ["How It Works", "/how-it-works"], ["Dashboard", "/dashboard"]] as const).map(([label, href]) => (
            <Link key={href} href={href} style={{ textDecoration: "none", color: "#4a5568", fontSize: 15, fontWeight: 400, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#2563eb")}
              onMouseLeave={e => (e.currentTarget.style.color = "#4a5568")}
            >{label}</Link>
          ))}
        </div>

        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <button style={{
            background: "#0a1628", color: "#fff", border: "none", borderRadius: 50,
            padding: "11px 26px", fontSize: 14, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 16px rgba(10,22,40,0.22)", transition: "all 0.22s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#2563eb"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#0a1628"; }}
          >
            Try Free
            <span style={{ background: "rgba(255,255,255,0.18)", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>→</span>
          </button>
        </Link>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 80px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "8%", right: "8%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(229,62,62,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* LEFT */}
        <div style={{ flex: 1, maxWidth: 560, zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.09)", borderRadius: 50, padding: "6px 16px 6px 8px", marginBottom: 32, border: "1px solid rgba(37,99,235,0.18)" }}>
            <span style={{ background: "#2563eb", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white" }}>✦</span>
            <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>AI-Powered Cardiac Analysis</span>
          </div>

          <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: "clamp(72px,8vw,110px)", lineHeight: 0.95, color: "#0a1628", marginBottom: 24, letterSpacing: "0.01em" }}>
            Your Heart<br />
            <span style={{ color: "#2563eb" }}>Data,</span> Decoded<br />
            by AI
          </h1>

          <p style={{ fontSize: 18, color: "#4a5568", lineHeight: 1.75, marginBottom: 44, fontWeight: 300, maxWidth: 420 }}>
            Upload your EKG report and watch your heart beat in real-time 3D — powered by Claude AI. Understand every interval, rhythm, and finding in plain English.
          </p>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 44 }}>
            <div style={{ display: "flex" }}>
              {["#4a90d9","#e8734a","#5cb85c"].map((c, i) => (
                <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${c}, ${c}99)`, border: "2.5px solid white", marginLeft: i > 0 ? -12 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  {["👨‍⚕️","👩","👨"][i]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 18, color: "#0a1628" }}>+10K</div>
              <div style={{ fontSize: 12, color: "#718096", letterSpacing: "0.08em" }}>PATIENTS ANALYZED</div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button style={{ background: "#0a1628", color: "white", border: "none", borderRadius: 50, padding: "16px 32px", fontSize: 16, fontWeight: 500, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 28px rgba(10,22,40,0.25)", transition: "all 0.25s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.background = "#2563eb"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.background = "#0a1628"; }}
              >
                Analyze My EKG
                <span style={{ background: "#2563eb", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>→</span>
              </button>
            </Link>
            <Link href="/how-it-works" style={{ textDecoration: "none" }}>
              <button style={{ background: "transparent", color: "#4a5568", border: "1.5px solid rgba(0,0,0,0.14)", borderRadius: 50, padding: "16px 28px", fontSize: 15, fontWeight: 400, transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2563eb"; (e.currentTarget as HTMLButtonElement).style.color = "#2563eb"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.14)"; (e.currentTarget as HTMLButtonElement).style.color = "#4a5568"; }}
              >
                How It Works
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT — heart + cards */}
        <div style={{ flex: 1, position: "relative", height: 640, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Main heart */}
          <div ref={heartRef} style={{
            width: 440, height: 440,
            background: "radial-gradient(ellipse at 38% 35%, #c8253a 0%, #8a0f20 40%, #3d0008 100%)",
            borderRadius: "44% 56% 62% 38% / 42% 38% 62% 58%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 180,
            boxShadow: "0 40px 100px rgba(160,15,35,0.4), 0 0 0 1px rgba(255,100,100,0.08) inset, 0 0 60px rgba(220,30,50,0.15) inset",
            animation: "heartbeat 0.85s ease-in-out infinite, floatHeart 4s ease-in-out infinite",
            transform: "rotate(-8deg)",
            transition: "transform 0.18s ease-out",
            position: "relative", overflow: "hidden", userSelect: "none",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 32% 28%, rgba(255,130,110,0.22) 0%, transparent 55%)", borderRadius: "inherit" }} />
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.28 }} viewBox="0 0 440 440">
              <path d="M220,75 C242,118 265,158 248,215 C231,272 192,292 212,375" stroke="#ff7777" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M220,75 C195,125 175,168 185,228 C196,288 228,305 210,375" stroke="#ff7777" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M220,95 C272,130 300,165 292,222" stroke="#ff9999" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M220,95 C165,138 148,178 158,238" stroke="#5577ff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M185,140 C155,162 140,198 152,240" stroke="#4466ee" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
            <span style={{ position: "relative", zIndex: 2 }}>🫀</span>
          </div>

          {/* Card 1 — Biomarker */}
          <div style={{ position: "absolute", left: 0, top: "22%", background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)", borderRadius: 20, padding: "22px 26px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.9)", animation: "floatCard1 3.5s ease-in-out infinite", minWidth: 190 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", boxShadow: "0 0 8px #2563eb" }} />
              <span style={{ fontSize: 11, color: "#718096", letterSpacing: "0.05em" }}>Biomarker Analysis</span>
            </div>
            <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 24, color: "#0a1628", marginBottom: 3 }}>Real-time</div>
            <div style={{ fontSize: 13, color: "#718096" }}>cardiac insights</div>
            <div style={{ marginTop: 14, height: 3, background: "linear-gradient(90deg, #2563eb, transparent)", borderRadius: 2 }} />
          </div>

          {/* Card 2 — AI Summary */}
          <div style={{ position: "absolute", right: 0, bottom: "16%", background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)", borderRadius: 20, padding: "22px 26px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.9)", animation: "floatCard2 4s ease-in-out infinite", minWidth: 190 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
              <span style={{ fontSize: 11, color: "#718096", letterSpacing: "0.05em" }}>AI Summary</span>
            </div>
            <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 24, color: "#0a1628", marginBottom: 3 }}>Decoded</div>
            <div style={{ fontSize: 13, color: "#718096" }}>in plain English</div>
            <div style={{ marginTop: 14, height: 3, background: "linear-gradient(90deg, #10b981, transparent)", borderRadius: 2 }} />
          </div>

          {/* BPM pill */}
          <div style={{ position: "absolute", top: "10%", right: "12%", background: "rgba(10,22,40,0.88)", backdropFilter: "blur(14px)", borderRadius: 50, padding: "9px 22px", display: "flex", alignItems: "center", gap: 10, animation: "floatCard1 2.8s ease-in-out infinite" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff4466", animation: "blink 0.85s ease infinite" }} />
            <span style={{ color: "white", fontSize: 15, fontWeight: 600, fontFamily: "Bebas Neue,sans-serif" }}>72 BPM</span>
            <span style={{ color: "rgba(255,255,255,0.38)", fontSize: 12 }}>Normal</span>
          </div>

          {/* Interval pill */}
          <div style={{ position: "absolute", bottom: "8%", left: "8%", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(14px)", borderRadius: 50, padding: "9px 20px", display: "flex", alignItems: "center", gap: 10, animation: "floatCard2 3.2s ease-in-out infinite", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
            <span style={{ fontSize: 13, color: "#4a5568" }}>QTc</span>
            <span style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 14, color: "#10b981" }}>424 ms</span>
            <span style={{ fontSize: 11, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: 50 }}>Normal</span>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: "#0a1628", padding: "48px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40, maxWidth: 1100, margin: "0 auto" }}>
          {[{ num:"10K+", label:"EKGs Analyzed", icon:"📊" }, { num:"99%", label:"AI Accuracy", icon:"🎯" }, { num:"<10s", label:"Analysis Time", icon:"⚡" }, { num:"6", label:"Rhythm Types", icon:"🫀" }].map(item => (
            <div key={item.num} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 800, fontSize: 38, color: "white", marginBottom: 6 }}>{item.num}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES — staggered offset cards matching reference design */}
      <section style={{ padding: "100px 0 120px", background: "white", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72, padding: "0 80px" }}>
          <div style={{ display: "inline-block", background: "rgba(37,99,235,0.09)", borderRadius: 50, padding: "6px 18px", marginBottom: 24, border: "1px solid rgba(37,99,235,0.16)" }}>
            <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>What CardioViz Does</span>
          </div>
          <h2 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: "clamp(52px,6vw,80px)", color: "#0a1628", lineHeight: 0.95, letterSpacing: "0.01em", maxWidth: 700, margin: "0 auto 16px" }}>
            Designed to Deliver<br />Clarity and Trust
          </h2>
          <p style={{ fontSize: 16, color: "#9ca3af", fontWeight: 300 }}>
            Trusted by patients, clinics, and wellness professionals worldwide.
          </p>
        </div>

        {/* Staggered cards */}
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "0 60px 20px", overflowX: "auto" }}>

          {/* Card 1 — Black, starts at top */}
          <div style={{ flex: "0 0 270px", minHeight: 360, background: "#0d1117", borderRadius: 28, padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: 0, cursor: "default", transition: "transform 0.3s, box-shadow 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 30px 70px rgba(0,0,0,0.25)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
          >
            <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🫀</div>
            <div>
              <h3 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 24, color: "white", lineHeight: 1.2, marginBottom: 12 }}>Early detection<br />of health risks</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>Spot cardiac issues before they become serious.</p>
            </div>
          </div>

          {/* Card 2 — Dark wine/purple gradient, offset down 60px */}
          <div style={{ flex: "0 0 290px", minHeight: 400, background: "linear-gradient(160deg, #5c1a2a 0%, #2d0e40 55%, #1a1050 100%)", borderRadius: 28, padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: 60, cursor: "default", transition: "transform 0.3s, box-shadow 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 30px 70px rgba(80,20,60,0.35)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
          >
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
            <div>
              <h3 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 24, color: "white", lineHeight: 1.2, marginBottom: 12 }}>AI-powered<br />interpretation<br />(no doctor-speak)</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>Get clear insights without medical jargon.</p>
            </div>
          </div>

          {/* Card 3 — Frosted blue, offset down 20px */}
          <div style={{ flex: "0 0 290px", minHeight: 380, background: "linear-gradient(145deg, #b8d4ee 0%, #96b8e0 50%, #7aa0cc 100%)", borderRadius: 28, padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: 20, cursor: "default", transition: "transform 0.3s, box-shadow 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 30px 70px rgba(100,150,200,0.3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
          >
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📈</div>
            <div>
              <h3 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 24, color: "#0a1628", lineHeight: 1.2, marginBottom: 12 }}>Live EKG Strip,<br />Beat-by-beat trace<br /><span style={{ color: "#1d4ed8" }}>& more</span></h3>
              <p style={{ fontSize: 14, color: "rgba(10,22,40,0.55)", lineHeight: 1.65 }}>Stay on top of your cardiac rhythm in real time.</p>
            </div>
          </div>

          {/* Card 4 — Light grey, offset down 90px */}
          <div style={{ flex: "0 0 270px", minHeight: 360, background: "#f0f4f8", borderRadius: 28, padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: 90, cursor: "default", transition: "transform 0.3s, box-shadow 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 30px 70px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
          >
            <div style={{ width: 50, height: 50, borderRadius: 14, background: "white", border: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>📋</div>
            <div>
              <h3 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 24, color: "#0a1628", lineHeight: 1.2, marginBottom: 12 }}>Visual dashboards,<br />alerts &<br />smart reports</h3>
              <p style={{ fontSize: 14, color: "#718096", lineHeight: 1.65 }}>Trends, alerts, and interval insights at a glance.</p>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS — dark navy, big bold heading, circle icons with connecting line */}
      <section style={{ background: "linear-gradient(160deg, #0d1628 0%, #0f1d35 50%, #0d1a30 100%)", padding: "100px 80px 120px", position: "relative", overflow: "hidden" }}>
        {/* Subtle radial glow top-right */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Badge */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", borderRadius: 50, padding: "8px 22px", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 400, letterSpacing: "0.04em" }}>Simple Process</span>
            </div>
          </div>

          {/* Big bold heading */}
          <h2 style={{ textAlign: "center", fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: "clamp(72px,10vw,130px)", color: "white", lineHeight: 0.92, letterSpacing: "0.01em", marginBottom: 80 }}>
            From PDF to<br />3D in Seconds
          </h2>

          {/* Steps */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, position: "relative", marginBottom: 72 }}>
            {/* Connecting line between icons */}
            <div style={{ position: "absolute", top: 44, left: "calc(16.67% + 36px)", right: "calc(16.67% + 36px)", height: 1, background: "linear-gradient(90deg, rgba(37,99,235,0.5), rgba(37,99,235,0.8), rgba(37,99,235,0.5))", zIndex: 1, pointerEvents: "none" }} />

            {[
              { step:"01", icon:"📄", title:"Upload Your PDF", desc:"Drag and drop your EKG report from any doctor or hospital. Any standard 12-lead ECG PDF works." },
              { step:"02", icon:"🤖", title:"AI Analyzes It", desc:"Claude AI reads the report, extracts BPM, rhythm, all intervals, findings, and writes a plain-English summary." },
              { step:"03", icon:"🫀", title:"Watch It Live", desc:"Your heart beats in 3D at your exact rate. Explore the live EKG strip, anatomical view, and all stats." },
            ].map(s => (
              <div key={s.step} style={{ textAlign: "center", position: "relative", zIndex: 2, padding: "0 32px" }}>
                {/* Circle icon — solid navy fill like reference */}
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(30,50,100,0.9)", border: "2px solid rgba(37,99,235,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 32px", boxShadow: "0 0 0 8px rgba(37,99,235,0.06), 0 8px 32px rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}>
                  {s.icon}
                </div>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: 11, color: "rgba(100,140,220,0.7)", letterSpacing: "0.2em", marginBottom: 12 }}>{s.step}</div>
                <h3 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 800, fontSize: 22, color: "white", marginBottom: 14, letterSpacing: "-0.01em" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", lineHeight: 1.75, maxWidth: 240, margin: "0 auto" }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA button — wide pill with arrow circle */}
          <div style={{ textAlign: "center" }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button style={{ background: "#2563eb", color: "white", border: "none", borderRadius: 50, padding: "20px 52px", fontSize: 18, fontWeight: 600, boxShadow: "0 8px 32px rgba(37,99,235,0.45)", transition: "all 0.25s", display: "inline-flex", alignItems: "center", gap: 16, letterSpacing: "-0.01em", minWidth: 340 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 16px 48px rgba(37,99,235,0.55)"; (e.currentTarget as HTMLButtonElement).style.background = "#1d4ed8"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(37,99,235,0.45)"; (e.currentTarget as HTMLButtonElement).style.background = "#2563eb"; }}
              >
                Analyze My EKG Now
                <span style={{ background: "rgba(255,255,255,0.22)", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CTA — light grey, centered, "See Dashboard" pill button */}
      <section style={{ background: "linear-gradient(160deg, #e8eef8 0%, #dde6f4 100%)", padding: "120px 80px 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 400, fontSize: "clamp(60px,7vw,96px)", color: "#1a2540", lineHeight: 0.95, letterSpacing: "0.01em", marginBottom: 24 }}>
            Your Cardiac Data,<br />Decoded by AI
          </h2>
          <p style={{ fontSize: 17, color: "#6b7a9a", lineHeight: 1.75, marginBottom: 48, fontWeight: 300 }}>
            CardioViz helps you track, understand, and act on your EKG — with smart AI insights and a live 3D heartbeat.
          </p>
          {/* The distinctive pill+circle button from reference */}
          <Link href="/dashboard" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)", borderRadius: 50, boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid rgba(255,255,255,0.9)", overflow: "hidden", transition: "all 0.25s" }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 60px rgba(37,99,235,0.2)"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 40px rgba(0,0,0,0.08)"}
            >
              <span style={{ padding: "18px 32px", fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 18, color: "#0a1628", letterSpacing: "-0.01em" }}>See Dashboard</span>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#4a90e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "6px 6px 6px 0", flexShrink: 0, boxShadow: "0 4px 16px rgba(37,99,235,0.4)" }}>
                <span style={{ color: "white", fontSize: 22, transform: "rotate(-45deg)", display: "block" }}>↗</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "linear-gradient(160deg, #e8eef8 0%, #dde6f4 100%)", padding: "80px 80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 60, flexWrap: "wrap", gap: 40 }}>
            {/* Logo */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>🫀</span>
                <span style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 800, fontSize: 22, color: "#1a2540" }}>Cardio<span style={{ color: "#2563eb" }}>Viz</span></span>
              </div>
            </div>

            {/* Links columns */}
            <div style={{ display: "flex", gap: 80 }}>
              <div>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 16, color: "#1a2540", marginBottom: 20 }}>Links</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {([["About Us", "/about-us"], ["How It Works", "/how-it-works"], ["Dashboard", "/dashboard"], ["Download App", "#"]] as const).map(([l, h]) => (
                    <Link key={l} href={h} style={{ color: "#6b7a9a", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#2563eb")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#6b7a9a")}
                    >{l}</Link>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontWeight: 700, fontSize: 16, color: "#1a2540", marginBottom: 20 }}>Social</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[["𝕏 Twitter", "#"], ["📸 Instagram", "#"], ["💼 LinkedIn", "#"]].map(([l, h]) => (
                    <a key={l} href={h} style={{ color: "#6b7a9a", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#2563eb")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#6b7a9a")}
                    >{l}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#9ca3af" }}>© CardioViz 2025</span>
              <span style={{ fontSize: 14, color: "#9ca3af" }}>All rights reserved</span>
              <a href="#" style={{ fontSize: 14, color: "#9ca3af", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#2563eb")}
                onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
              >Privacy policy</a>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {["𝔽", "📷"].map(icon => (
                <div key={icon} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "#2563eb"; (e.currentTarget as HTMLDivElement).style.color = "white"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.06)"; (e.currentTarget as HTMLDivElement).style.color = "inherit"; }}
                >{icon}</div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes heartbeat {
          0%,100% { transform: scale(1) rotate(-8deg); }
          14% { transform: scale(1.09) rotate(-8deg); }
          28% { transform: scale(1.04) rotate(-8deg); }
          42% { transform: scale(1.07) rotate(-8deg); }
        }
        @keyframes floatHeart {
          0%,100% { margin-top: 0; }
          50% { margin-top: -22px; }
        }
        @keyframes floatCard1 {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatCard2 {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes blink {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.75); }
        }
      `}</style>
    </div>
  );
}
