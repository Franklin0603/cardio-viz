"use client";

import { useRef, useState } from "react";
import { EKGData } from "@/lib/types";
import DemoSelector from "./DemoSelector";
import styles from "./UploadScreen.module.css";

interface Props {
  onFile: (file: File) => void;
  onDemo: (data: EKGData) => void;
}

export default function UploadScreen({ onFile, onDemo }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type === "application/pdf") onFile(file);
    else alert("Please upload a PDF file.");
  };

  return (
    <div className={styles.screen}>
      <div
        className={`${styles.zone} ${dragging ? styles.drag : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <div className={styles.icon}>🫀</div>
        <h2 className={styles.title}>Upload EKG Report</h2>
        <p className={styles.sub}>PDF from doctor or hospital · drag &amp; drop or click</p>
        <button
          className={styles.btn}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          SELECT PDF FILE
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>

      <p className={styles.note}>
        Your PDF is analyzed securely · never stored · API key stays on the server
      </p>

      <DemoSelector onSelect={onDemo} />
    </div>
  );
}
