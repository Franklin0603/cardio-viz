export interface EKGInterval {
  value: number | null;
  normal: boolean;
}

export interface EKGData {
  patient: {
    name: string;
    age: string;
    gender: string;
    date: string;
    referringDoctor: string;
  };
  vitals: {
    heartRate: number | null;
    rhythm: string;
    axis: string;
    interpretation: "Normal" | "Abnormal" | "Borderline";
  };
  intervals: {
    PR: EKGInterval;
    QRS: EKGInterval;
    QT: EKGInterval;
    QTc: EKGInterval;
    RR: EKGInterval;
  };
  findings: string[];
  summary: string;
  waveformShape:
    | "normal_sinus"
    | "bradycardia"
    | "tachycardia"
    | "afib"
    | "pvcs"
    | "heart_block";
}
