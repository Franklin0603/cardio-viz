import { EKGData } from "./types";

export interface DemoCase {
  id: string;
  label: string;
  description: string;
  badge: string;
  badgeColor: string;
  data: EKGData;
}

export const DEMO_CASES: DemoCase[] = [
  {
    id: "normal",
    label: "Normal Sinus Rhythm",
    description: "Healthy 34-year-old male, routine physical",
    badge: "NORMAL",
    badgeColor: "#00ff88",
    data: {
      patient: {
        name: "James Okafor",
        age: "34",
        gender: "Male",
        date: "2024-11-12",
        referringDoctor: "Chen",
      },
      vitals: {
        heartRate: 72,
        rhythm: "Normal Sinus Rhythm",
        axis: "Normal axis (+45°)",
        interpretation: "Normal",
      },
      intervals: {
        PR:  { value: 162, normal: true },
        QRS: { value: 88,  normal: true },
        QT:  { value: 400, normal: true },
        QTc: { value: 424, normal: true },
        RR:  { value: 833, normal: true },
      },
      findings: [
        "Normal sinus rhythm at 72 BPM",
        "Normal PR interval",
        "Normal QRS duration",
        "Normal QTc interval",
        "No ST changes detected",
        "No evidence of hypertrophy",
      ],
      summary:
        "This is a completely normal EKG. Your heart is beating at a healthy rate and rhythm with all electrical intervals within normal limits. No signs of any cardiac abnormality were detected.",
      waveformShape: "normal_sinus",
    },
  },
  {
    id: "afib",
    label: "Atrial Fibrillation",
    description: "67-year-old female, palpitation complaint",
    badge: "ABNORMAL",
    badgeColor: "#ff2244",
    data: {
      patient: {
        name: "Margaret Sullivan",
        age: "67",
        gender: "Female",
        date: "2024-10-03",
        referringDoctor: "Patel",
      },
      vitals: {
        heartRate: 98,
        rhythm: "Atrial Fibrillation",
        axis: "Normal axis (+30°)",
        interpretation: "Abnormal",
      },
      intervals: {
        PR:  { value: null as unknown as number, normal: false },
        QRS: { value: 94,  normal: true },
        QT:  { value: 380, normal: true },
        QTc: { value: 472, normal: false },
        RR:  { value: 612, normal: false },
      },
      findings: [
        "Irregularly irregular rhythm consistent with atrial fibrillation",
        "Absent P waves — fibrillatory baseline present",
        "Ventricular rate 98 BPM (controlled)",
        "Prolonged QTc at 472ms",
        "No acute ST elevation or depression",
        "No evidence of prior myocardial infarction",
      ],
      summary:
        "This EKG shows atrial fibrillation, a condition where the upper chambers of the heart beat irregularly. Your ventricular rate is reasonably controlled at 98 BPM. This finding should be discussed with your cardiologist to evaluate stroke risk and treatment options.",
      waveformShape: "afib",
    },
  },
  {
    id: "tachy",
    label: "Sinus Tachycardia",
    description: "28-year-old male, post-exercise evaluation",
    badge: "BORDERLINE",
    badgeColor: "#ffaa00",
    data: {
      patient: {
        name: "Devon Ramirez",
        age: "28",
        gender: "Male",
        date: "2024-09-18",
        referringDoctor: "Williams",
      },
      vitals: {
        heartRate: 118,
        rhythm: "Sinus Tachycardia",
        axis: "Normal axis (+60°)",
        interpretation: "Borderline",
      },
      intervals: {
        PR:  { value: 148, normal: true },
        QRS: { value: 84,  normal: true },
        QT:  { value: 320, normal: true },
        QTc: { value: 436, normal: true },
        RR:  { value: 508, normal: false },
      },
      findings: [
        "Sinus tachycardia at 118 BPM",
        "Normal P-wave morphology",
        "Short RR interval consistent with elevated rate",
        "No ST segment abnormalities",
        "No ectopic beats identified",
        "Consider underlying cause: fever, anxiety, dehydration, anemia",
      ],
      summary:
        "Your heart is beating faster than normal at 118 beats per minute, a condition called sinus tachycardia. The rhythm is otherwise normal. This is often caused by temporary factors like exercise, stress, dehydration, or caffeine. Your doctor may investigate for an underlying cause.",
      waveformShape: "tachycardia",
    },
  },
  {
    id: "brady",
    label: "Sinus Bradycardia",
    description: "52-year-old athlete, annual cardiac screen",
    badge: "BORDERLINE",
    badgeColor: "#ffaa00",
    data: {
      patient: {
        name: "Sarah Kimani",
        age: "52",
        gender: "Female",
        date: "2024-12-01",
        referringDoctor: "Nguyen",
      },
      vitals: {
        heartRate: 48,
        rhythm: "Sinus Bradycardia",
        axis: "Normal axis (+15°)",
        interpretation: "Borderline",
      },
      intervals: {
        PR:  { value: 188, normal: true },
        QRS: { value: 96,  normal: true },
        QT:  { value: 460, normal: false },
        QTc: { value: 401, normal: true },
        RR:  { value: 1250, normal: false },
      },
      findings: [
        "Sinus bradycardia at 48 BPM",
        "Normal P-wave axis and morphology",
        "Prolonged RR interval at 1250ms",
        "Slightly prolonged QT — rate-corrected QTc is normal",
        "No bundle branch block",
        "Findings consistent with athletic conditioning",
      ],
      summary:
        "Your heart rate is slower than average at 48 BPM, called sinus bradycardia. In your case this is most likely a sign of excellent cardiovascular fitness from regular athletic training. The rhythm is otherwise normal and all corrected intervals are within acceptable range.",
      waveformShape: "bradycardia",
    },
  },
  {
    id: "heartblock",
    label: "First Degree Heart Block",
    description: "61-year-old male, hypertension follow-up",
    badge: "ABNORMAL",
    badgeColor: "#ff2244",
    data: {
      patient: {
        name: "Robert Hoffman",
        age: "61",
        gender: "Male",
        date: "2024-08-27",
        referringDoctor: "Assad",
      },
      vitals: {
        heartRate: 64,
        rhythm: "Sinus Rhythm with 1st Degree AV Block",
        axis: "Left axis deviation (−25°)",
        interpretation: "Abnormal",
      },
      intervals: {
        PR:  { value: 240, normal: false },
        QRS: { value: 102, normal: true },
        QT:  { value: 420, normal: true },
        QTc: { value: 434, normal: true },
        RR:  { value: 938, normal: true },
      },
      findings: [
        "First degree AV block — PR interval prolonged at 240ms",
        "Left axis deviation",
        "Normal QRS morphology, no bundle branch block",
        "No ST elevation or depression",
        "T-wave flattening in leads I and aVL",
        "Correlate with medications (beta-blockers, calcium channel blockers)",
      ],
      summary:
        "This EKG shows a first degree heart block, meaning the electrical signal from your upper to lower heart chambers is slightly delayed. At 240ms, your PR interval is mildly prolonged. This is often benign but should be monitored, especially in the context of any heart or blood pressure medications you may be taking.",
      waveformShape: "heart_block",
    },
  },
];
