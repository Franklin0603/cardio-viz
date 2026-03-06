"use client";

import styles from "./LoadingScreen.module.css";

interface Props {
  message: string;
  progress: number;
}

export default function LoadingScreen({ message, progress }: Props) {
  return (
    <div className={styles.screen}>
      <div className={styles.heart}>🫀</div>
      <div className={styles.msg}>{message}</div>
      <div className={styles.barWrap}>
        <div className={styles.bar} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.pct}>{progress}%</div>
    </div>
  );
}
