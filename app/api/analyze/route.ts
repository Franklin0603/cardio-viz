import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a cardiology data extraction AI. Analyze EKG/ECG report PDFs and extract structured data.
Always return ONLY valid JSON with no markdown fences, no preamble, no explanation.`;

const USER_PROMPT = `Analyze this EKG/ECG report and extract all available data.

Return ONLY a valid JSON object with this exact structure:
{
  "patient": {
    "name": "string or Unknown",
    "age": "string or Unknown",
    "gender": "string or Unknown",
    "date": "string or Unknown",
    "referringDoctor": "string or Unknown"
  },
  "vitals": {
    "heartRate": <integer BPM or null>,
    "rhythm": "e.g. Normal Sinus Rhythm",
    "axis": "e.g. Normal axis",
    "interpretation": "Normal" | "Abnormal" | "Borderline"
  },
  "intervals": {
    "PR":  { "value": <ms or null>, "normal": <true|false> },
    "QRS": { "value": <ms or null>, "normal": <true|false> },
    "QT":  { "value": <ms or null>, "normal": <true|false> },
    "QTc": { "value": <ms or null>, "normal": <true|false> },
    "RR":  { "value": <ms or null>, "normal": <true|false> }
  },
  "findings": ["array of key findings as strings"],
  "summary": "2-3 sentence plain-English summary for the patient",
  "waveformShape": "normal_sinus" | "bradycardia" | "tachycardia" | "afib" | "pvcs" | "heart_block"
}

Rules:
- Use null for missing numeric values
- Use "Unknown" for missing string values  
- waveformShape must be one of the 6 options listed
- Always return valid JSON only`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { pdfBase64 } = await req.json();

    if (!pdfBase64) {
      return NextResponse.json(
        { error: "No PDF data provided" },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: pdfBase64,
              },
            },
            {
              type: "text",
              text: USER_PROMPT,
            },
          ] as any,
        },
      ],
    });

    const rawText = message.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");

    const clean = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("EKG analysis error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
