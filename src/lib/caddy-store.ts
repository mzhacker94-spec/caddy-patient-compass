/**
 * Front-end only mock store for the Caddy Care UI pass.
 * Persists to localStorage so the login -> profile -> dashboard flow feels real
 * before any backend is wired in.
 */

export type Role = "patient" | "doctor";

export type CaddyProfile = {
  name: string;
  email: string;
  role: Role;
  phone: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  city: string;
  allergies: string;
  conditions: string;
  emergencyName: string;
  emergencyPhone: string;
  insurance: string;
  avatarHue: number;
  completedOnboarding: boolean;
};

export type Report = {
  id: string;
  title: string;
  kind: "Lab" | "Imaging" | "Prescription" | "Note";
  date: string;
  doctor: string;
  summary: string;
  sharedWithDoctor: boolean;
};

export type CaddyNotification = {
  id: string;
  title: string;
  body: string;
  kind: "queue" | "report" | "appointment" | "streak";
  time: string;
  read: boolean;
};

const KEY = "caddy-care-state-v1";

export type CaddyState = {
  profile: CaddyProfile | null;
  reports: Report[];
  notifications: CaddyNotification[];
  /** last 28 days of check-in activity, 0-4 intensity */
  streak: number[];
};

export const EMPTY_PROFILE: CaddyProfile = {
  name: "",
  email: "",
  role: "patient",
  phone: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  city: "",
  allergies: "",
  conditions: "",
  emergencyName: "",
  emergencyPhone: "",
  insurance: "",
  avatarHue: 195,
  completedOnboarding: false,
};

export const SEED_REPORTS: Report[] = [
  {
    id: "r1",
    title: "Complete Blood Count",
    kind: "Lab",
    date: "2026-08-12",
    doctor: "Dr. Omar Shafiq",
    summary: "Haemoglobin 13.4 g/dL · WBC normal · mild vitamin D deficiency noted.",
    sharedWithDoctor: true,
  },
  {
    id: "r2",
    title: "Dental Panoramic X-Ray",
    kind: "Imaging",
    date: "2026-07-28",
    doctor: "Dr. Aisha Rahman",
    summary: "Impacted lower-left wisdom tooth. Extraction advised within 3 months.",
    sharedWithDoctor: true,
  },
  {
    id: "r3",
    title: "Vitamin D + Calcium plan",
    kind: "Prescription",
    date: "2026-07-02",
    doctor: "Dr. Omar Shafiq",
    summary: "Cholecalciferol 60k IU weekly for 8 weeks, then monthly maintenance.",
    sharedWithDoctor: false,
  },
];

export const SEED_NOTIFICATIONS: CaddyNotification[] = [
  {
    id: "n1",
    title: "You're 3rd in the queue",
    body: "Dr. Aisha Rahman · Room 3 · leave now to arrive on time.",
    kind: "queue",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    title: "New report available",
    body: "Complete Blood Count results were added to your health vault.",
    kind: "report",
    time: "1 h ago",
    read: false,
  },
  {
    id: "n3",
    title: "Streak saved 🔥",
    body: "12-day care streak — you logged your medication on time.",
    kind: "streak",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n4",
    title: "Appointment confirmed",
    body: "Tue 2 Sep, 4:30 PM with Dr. Lena Haq at Glow Skin Lab.",
    kind: "appointment",
    time: "2 days ago",
    read: true,
  },
];

function seedStreak(): number[] {
  const base = [
    2, 3, 1, 0, 2, 4, 3, 2, 0, 1, 3, 4, 4, 2, 1, 0, 2, 3, 4, 3, 2, 4, 1, 0, 3, 4, 4, 2,
  ];
  return base;
}

export const INITIAL_STATE: CaddyState = {
  profile: null,
  reports: SEED_REPORTS,
  notifications: SEED_NOTIFICATIONS,
  streak: seedStreak(),
};

export function loadState(): CaddyState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return INITIAL_STATE;
    return { ...INITIAL_STATE, ...(JSON.parse(raw) as Partial<CaddyState>) };
  } catch {
    return INITIAL_STATE;
  }
}

export function saveState(state: CaddyState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

export function currentStreak(streak: number[]): number {
  let n = 0;
  for (let i = streak.length - 1; i >= 0; i--) {
    if ((streak[i] ?? 0) > 0) n++;
    else break;
  }
  return n;
}

export type PatientHistory = {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  condition: string;
  risk: "low" | "medium" | "high";
  visits: { date: string; note: string; kind: Report["kind"] }[];
};

export const DOCTOR_PATIENTS: PatientHistory[] = [
  {
    id: "p1",
    name: "Hamza Iqbal",
    age: 34,
    lastVisit: "2026-08-21",
    condition: "Type 2 diabetes follow-up",
    risk: "medium",
    visits: [
      { date: "2026-08-21", note: "HbA1c 7.2 — metformin dose held steady.", kind: "Lab" },
      { date: "2026-06-14", note: "Diet plan revised, added evening walk goal.", kind: "Note" },
      { date: "2026-03-02", note: "Started metformin 500mg BD.", kind: "Prescription" },
    ],
  },
  {
    id: "p2",
    name: "Sara Nadeem",
    age: 27,
    lastVisit: "2026-08-18",
    condition: "Recurrent migraine",
    risk: "low",
    visits: [
      { date: "2026-08-18", note: "MRI clear. Trigger diary advised.", kind: "Imaging" },
      { date: "2026-05-09", note: "Prescribed sumatriptan PRN.", kind: "Prescription" },
    ],
  },
  {
    id: "p3",
    name: "Bilal Ahmed",
    age: 52,
    lastVisit: "2026-08-25",
    condition: "Hypertension · stage 2",
    risk: "high",
    visits: [
      { date: "2026-08-25", note: "BP 158/98 — added amlodipine 5mg.", kind: "Prescription" },
      { date: "2026-07-11", note: "ECG shows LVH. Cardiology referral sent.", kind: "Imaging" },
      { date: "2026-04-30", note: "Baseline labs — creatinine normal.", kind: "Lab" },
    ],
  },
];
