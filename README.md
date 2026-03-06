# 🫀 CardioViz — EKG Heart Visualizer

Upload a PDF EKG report and watch your heart beat in real-time 3D — powered by Claude AI.

## What it does

- **Upload** any PDF EKG report from a doctor or hospital
- **Claude AI** reads the PDF server-side and extracts: BPM, rhythm, intervals (PR/QRS/QT/QTc/RR), findings, and a plain-English summary
- **3D heart** beats at your exact heart rate from the report
- **Live EKG strip** scrolls a waveform shaped to your rhythm type (normal sinus, AFib, tachycardia, bradycardia, heart block)
- **Stats panel** shows all measurements with normal/warning/alert indicators

---

## Setup (local dev)

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Anthropic API key
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key at: https://console.anthropic.com

### 3. Run
```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B — GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to https://vercel.com/new
3. Import your repo
4. Add environment variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key from console.anthropic.com
5. Deploy

> ✅ Your API key is **never exposed to the browser** — all Anthropic calls go through the `/api/analyze` server route.

---

## Project structure

```
ekg-visualizer/
├── app/
│   ├── api/analyze/route.ts   ← Secure server-side Anthropic call
│   ├── page.tsx               ← Main app orchestration
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── HeartCanvas.tsx        ← Three.js 3D beating heart
│   ├── EKGStrip.tsx           ← Live scrolling waveform
│   ├── StatsPanel.tsx         ← Measurements & AI summary
│   ├── UploadScreen.tsx       ← PDF drag & drop
│   └── LoadingScreen.tsx      ← Progress indicator
├── lib/
│   └── types.ts               ← EKGData TypeScript types
├── .env.local.example         ← Copy to .env.local and add your key
└── README.md
```

---

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| 3D | Three.js |
| AI | Anthropic Claude (claude-opus-4-5) |
| Styling | CSS Modules |
| Deploy | Vercel |

---

## Notes

- PDF is converted to base64 in the browser and sent to the Next.js API route
- The API route calls Anthropic with the PDF as a `document` block
- Claude extracts structured JSON — never stores the PDF
- Three.js is loaded client-side only (`dynamic` with `ssr: false`)
