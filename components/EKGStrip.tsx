"use client";

import { useEffect, useRef } from "react";
import { EKGData } from "@/lib/types";

interface Props { data: EKGData; }

function gaussPeak(x: number, mu: number, sigma: number) {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}

function buildWaveform(bpm: number, shape: EKGData["waveformShape"]): number[] {
  const samplesPerBeat = Math.round((60 / bpm) * 60);
  const beat: number[] = [];
  for (let i = 0; i < samplesPerBeat; i++) {
    const p = i / samplesPerBeat;
    let y = 0;
    switch (shape) {
      case "afib":
        y = (Math.random() - 0.5) * 0.06;
        if (p > 0.35 && p < 0.48) y += gaussPeak(p, 0.38, 0.012) * 0.85;
        if (p > 0.42 && p < 0.5)  y -= gaussPeak(p, 0.44, 0.008) * 0.22;
        break;
      case "tachycardia":
        y += gaussPeak(p, 0.12, 0.022) * 0.16;
        if (p > 0.3 && p < 0.5) y += gaussPeak(p, 0.38, 0.018) * 1.0;
        if (p > 0.4 && p < 0.55) y -= gaussPeak(p, 0.46, 0.01) * 0.22;
        break;
      case "bradycardia":
        y += gaussPeak(p, 0.1, 0.03) * 0.2;
        if (p > 0.4 && p < 0.6) y += gaussPeak(p, 0.47, 0.02) * 0.95;
        if (p > 0.5 && p < 0.65) y -= gaussPeak(p, 0.54, 0.01) * 0.18;
        if (p > 0.62 && p < 0.85) y += gaussPeak(p, 0.72, 0.055) * 0.28;
        break;
      case "heart_block":
        if (p > 0.06 && p < 0.15) y += gaussPeak(p, 0.11, 0.018) * 0.18;
        if (p > 0.48 && p < 0.65) y += gaussPeak(p, 0.56, 0.02) * 0.88;
        if (p > 0.58 && p < 0.7)  y -= gaussPeak(p, 0.63, 0.01) * 0.2;
        if (p > 0.68 && p < 0.88) y += gaussPeak(p, 0.78, 0.045) * 0.24;
        break;
      default:
        y += gaussPeak(p, 0.12, 0.025) * 0.18;
        if (p > 0.28 && p < 0.36) y -= gaussPeak(p, 0.31, 0.008) * 0.12;
        if (p > 0.30 && p < 0.46) y += gaussPeak(p, 0.36, 0.018) * 0.95;
        if (p > 0.38 && p < 0.5)  y -= gaussPeak(p, 0.43, 0.01) * 0.2;
        if (p > 0.55 && p < 0.82) y += gaussPeak(p, 0.67, 0.048) * 0.28;
    }
    beat.push(y);
  }
  const buffer: number[] = [];
  for (let r = 0; r < 12; r++) buffer.push(...beat);
  return buffer;
}

export default function EKGStrip({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const xRef      = useRef(0);
  const bufRef    = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const panel = canvas.parentElement!;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width  = panel.clientWidth  * dpr;
      canvas.height = panel.clientHeight * dpr;
      canvas.style.width  = panel.clientWidth  + "px";
      canvas.style.height = panel.clientHeight + "px";
    };
    resize();

    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    ctx.scale(dpr, dpr);
    const W = panel.clientWidth;
    const H = panel.clientHeight;

    bufRef.current = buildWaveform(data.vitals.heartRate ?? 72, data.waveformShape);
    xRef.current = 0;

    const SPEED = 2.5;

    const draw = () => {
      frameRef.current = requestAnimationFrame(draw);
      const buf = bufRef.current;

      // Scroll: copy left then clear right edge
      const imgW  = Math.max(1, Math.floor((W - SPEED) * dpr));
      const imgH  = Math.max(1, Math.floor(H * dpr));
      const img   = ctx.getImageData(Math.ceil(SPEED * dpr), 0, imgW, imgH);
      ctx.putImageData(img, 0, 0);
      ctx.clearRect(W - SPEED - 2, 0, SPEED + 3, H);

      for (let dx = 0; dx < SPEED; dx++) {
        const idx = Math.floor(xRef.current) % buf.length;
        const nxt = (idx + 1) % buf.length;
        const y0  = buf[idx], y1 = buf[nxt];
        const cy  = H / 2 - y0 * (H * 0.4);
        const ny  = H / 2 - y1 * (H * 0.4);
        const px  = W - SPEED + dx;

        const isRPeak = y0 > 0.35;

        ctx.beginPath();
        ctx.moveTo(px, cy);
        ctx.lineTo(px + 1, ny);
        ctx.strokeStyle   = isRPeak ? "#ff3344" : "#00e87a";
        ctx.lineWidth     = isRPeak ? 2.2 : 1.6;
        ctx.shadowColor   = isRPeak ? "#ff3344" : "#00e87a";
        ctx.shadowBlur    = isRPeak ? 14 : 6;
        ctx.stroke();

        xRef.current++;
      }
    };
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(panel);
    return () => { cancelAnimationFrame(frameRef.current); ro.disconnect(); };
  }, [data]);

  return (
    <div style={{
      height: 160,
      background: "#030f08",
      borderTop: "1px solid rgba(0,230,100,0.12)",
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* EKG grid — fine + coarse */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(0,200,80,0.055) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,200,80,0.055) 1px, transparent 1px),
          linear-gradient(rgba(0,200,80,0.11) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,200,80,0.11) 1px, transparent 1px)
        `,
        backgroundSize: "10px 10px, 10px 10px, 50px 50px, 50px 50px",
      }} />
      {/* Top border glow */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(0,230,100,0.25)", pointerEvents: "none" }} />
      {/* Label */}
      <div style={{
        position: "absolute", top: 9, left: 14, zIndex: 2,
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: 10, color: "rgba(0,230,100,0.5)",
        letterSpacing: "0.2em",
      }}>
        LEAD II — REAL-TIME
      </div>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}
