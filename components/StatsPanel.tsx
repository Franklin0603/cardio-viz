"use client";

import { EKGData } from "@/lib/types";
import styles from "./StatsPanel.module.css";

interface Props {
  data: EKGData;
  onReset: () => void;
}

const NORMAL_RANGES: Record<string, [number, number]> = {
  PR: [120, 200],
  QRS: [80, 120],
  QT: [350, 450],
  QTc: [350, 440],
  RR: [600, 1000],
};

export default function StatsPanel({ data, onReset }: Props) {
  const p = data.patient;
  const v = data.vitals;
  const bpm = v.heartRate;

  const bpmClass =
    bpm == null ? "" : bpm < 60 ? styles.warning : bpm > 100 ? styles.alert : styles.normal;

  return (
    <div className={styles.panel}>
      {/* Patient */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Patient</div>
        <div className={styles.patientName}>{p.name || "Unknown Patient"}</div>
        <div className={styles.patientMeta}>
          {[p.age, p.gender, p.date]
            .filter((x) => x && x !== "Unknown")
            .join(" · ") || "No demographic data"}
        </div>
        {p.referringDoctor && p.referringDoctor !== "Unknown" && (
          <div className={styles.patientMeta} style={{ marginTop: 4 }}>
            Dr. {p.referringDoctor}
          </div>
        )}
      </div>

      {/* Vitals */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Measurements</div>
        <StatRow label="Heart Rate" value={bpm ? `${bpm} bpm` : "—"} cls={bpmClass} />
        <StatRow label="Rhythm" value={v.rhythm || "—"} cls={styles.normal} />
        <StatRow label="Electrical Axis" value={v.axis || "—"} cls={styles.normal} />
        <StatRow
          label="Interpretation"
          value={v.interpretation || "—"}
          cls={
            v.interpretation === "Normal"
              ? styles.normal
              : v.interpretation === "Abnormal"
              ? styles.alert
              : styles.warning
          }
        />
      </div>

      {/* Intervals */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Intervals</div>
        {Object.entries(data.intervals).map(([key, obj]) => {
          if (!obj || obj.value == null) return null;
          const range = NORMAL_RANGES[key] ?? [0, 9999];
          const pct = Math.min(
            100,
            Math.max(5, ((obj.value - range[0]) / (range[1] - range[0])) * 100)
          );
          const cls = obj.normal === false ? styles.alert : styles.normal;
          return (
            <div key={key} className={styles.intervalRow}>
              <div className={styles.intervalTop}>
                <span className={styles.statLabel}>{key} interval</span>
                <span className={`${styles.statValue} ${cls}`}>
                  {obj.value} ms
                </span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${pct}%`,
                    background:
                      obj.normal === false ? "var(--red)" : "var(--green)",
                    boxShadow: `0 0 6px ${
                      obj.normal === false ? "var(--red)" : "var(--green)"
                    }`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Findings */}
      {data.findings?.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Findings</div>
          <ul className={styles.findingsList}>
            {data.findings.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>AI Summary</div>
        <p className={styles.summary}>{data.summary || "No summary available."}</p>
      </div>

      <button className={styles.resetBtn} onClick={onReset}>
        ↩ LOAD NEW REPORT
      </button>
    </div>
  );
}

function StatRow({
  label,
  value,
  cls,
}: {
  label: string;
  value: string;
  cls: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "8px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: "rgba(170,200,187,0.6)",
          fontWeight: 300,
        }}
      >
        {label}
      </span>
      <span
        className={cls}
        style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 14 }}
      >
        {value}
      </span>
    </div>
  );
}
