"use client";

import { DEMO_CASES } from "@/lib/demoCases";
import { EKGData } from "@/lib/types";
import styles from "./DemoSelector.module.css";

interface Props {
  onSelect: (data: EKGData) => void;
}

export default function DemoSelector({ onSelect }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.orDivider}>
          <span className={styles.orLine} />
          <span className={styles.orText}>OR TRY A DEMO CASE</span>
          <span className={styles.orLine} />
        </div>
        <p className={styles.sub}>5 real clinical scenarios — no PDF needed</p>
      </div>

      <div className={styles.grid}>
        {DEMO_CASES.map((c) => (
          <button
            key={c.id}
            className={styles.card}
            onClick={() => onSelect(c.data)}
          >
            <div className={styles.cardTop}>
              <span
                className={styles.badge}
                style={{
                  color: c.badgeColor,
                  borderColor: c.badgeColor,
                  boxShadow: `0 0 8px ${c.badgeColor}22`,
                }}
              >
                {c.badge}
              </span>
              <span className={styles.bpm}>
                {c.data.vitals.heartRate} BPM
              </span>
            </div>
            <div className={styles.label}>{c.label}</div>
            <div className={styles.desc}>{c.description}</div>
            <div className={styles.arrow}>→</div>
          </button>
        ))}
      </div>
    </div>
  );
}
