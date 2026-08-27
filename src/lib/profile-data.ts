import doc1 from "@/assets/doc-1.jpg";
import doc2 from "@/assets/doc-2.jpg";
import doc3 from "@/assets/doc-3.jpg";
import doc4 from "@/assets/doc-4.jpg";
import patientAvatar from "@/assets/patient-avatar.jpg";

/**
 * Front-end only mock data for the Patient Profile screen.
 * Two complete datasets — "populated" (a long-time Gold patient) and
 * "new" (a patient who signed up minutes ago) — so every section's
 * populated *and* graceful empty state is reviewable without a backend.
 */

export type MockState = "populated" | "new";

export type PatientTier = "Gold Patient" | "New Patient";

export type Patient = {
  name: string;
  memberSince: string;
  tier: PatientTier;
  avatar: string;
  city: string;
  bloodGroup: string;
};

export type StatKey = "visits" | "appointments" | "prescriptions" | "labs";

export type Stat = {
  key: StatKey;
  label: string;
  value: number;
  icon: "visits" | "calendar" | "pill" | "flask";
  tint: "care" | "ember" | "gold";
  hint: string;
};

export type StreakTile = {
  /** ISO-ish short label, e.g. "Mon 12" */
  label: string;
  /** 0 = missed, 1..4 = adherence intensity */
  level: number;
};

export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  clinic: string;
  photo: string;
  date: string;
  time: string;
  /** when true the card shows the live queue position block */
  checkedInToday: boolean;
  queuePosition: number;
  room: string;
  token: string;
};

export type Medicine = {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
};

export type Visit = {
  id: string;
  doctor: string;
  specialty: string;
  photo: string;
  date: string;
  complaint: string;
  complaintDetail: string;
  status: "Completed" | "Follow-up due" | "Cancelled";
  notes: string;
  medicines: Medicine[];
  attachments: { label: string; kind: "lab" | "image" | "prescription" }[];
};

export type Prescription = {
  id: string;
  doctor: string;
  date: string;
  photo: string;
  medicines: Medicine[];
  refillsLeft: number;
};

export type LabReport = {
  id: string;
  test: string;
  date: string;
  status: "Ready" | "Processing";
  lab: string;
  summary: string;
  values: { name: string; value: string; range: string; flag: "normal" | "high" | "low" }[];
};

export type ProfileMock = {
  patient: Patient;
  stats: Stat[];
  streak: StreakTile[];
  currentStreak: number;
  bestStreak: number;
  appointment: Appointment | null;
  visits: Visit[];
  prescriptions: Prescription[];
  labs: LabReport[];
};

const DAY_LABELS = [
  "Mon 04",
  "Tue 05",
  "Wed 06",
  "Thu 07",
  "Fri 08",
  "Sat 09",
  "Sun 10",
  "Mon 11",
  "Tue 12",
  "Wed 13",
  "Thu 14",
  "Fri 15",
  "Sat 16",
  "Sun 17",
];

const LEVELS = [4, 3, 4, 4, 2, 4, 3, 0, 4, 4, 3, 4, 4, 4];

export const POPULATED: ProfileMock = {
  patient: {
    name: "Sara Nadeem",
    memberSince: "Member since March 2021",
    tier: "Gold Patient",
    avatar: patientAvatar,
    city: "Karachi · Clifton",
    bloodGroup: "O+",
  },
  stats: [
    {
      key: "visits",
      label: "Total visits",
      value: 34,
      icon: "visits",
      tint: "care",
      hint: "across 6 clinics",
    },
    {
      key: "appointments",
      label: "Upcoming appointments",
      value: 2,
      icon: "calendar",
      tint: "ember",
      hint: "next one today",
    },
    {
      key: "prescriptions",
      label: "Prescriptions on file",
      value: 11,
      icon: "pill",
      tint: "gold",
      hint: "3 refillable",
    },
    {
      key: "labs",
      label: "Lab reports available",
      value: 7,
      icon: "flask",
      tint: "care",
      hint: "1 processing",
    },
  ],
  streak: DAY_LABELS.map((label, i) => ({ label, level: LEVELS[i] ?? 0 })),
  currentStreak: 6,
  bestStreak: 23,
  appointment: {
    id: "a1",
    doctor: "Dr. Aisha Rahman",
    specialty: "Dentist · Caddy Smile Studio",
    clinic: "Caddy Smile Studio",
    photo: doc1,
    date: "Today, 17 Aug",
    time: "4:30 PM",
    checkedInToday: true,
    queuePosition: 3,
    room: "Room 3",
    token: "Token A-24",
  },
  visits: [
    {
      id: "v1",
      doctor: "Dr. Omar Shafiq",
      specialty: "General Physician",
      photo: doc2,
      date: "02 Aug 2026",
      complaint: "Persistent fever & fatigue",
      complaintDetail:
        "Four days of evening fever peaking at 101°F with body aches, low appetite and disturbed sleep. No cough or breathlessness reported.",
      status: "Follow-up due",
      notes:
        "Viral illness suspected. CBC ordered to rule out dengue. Hydration and rest advised; return in 5 days if fever persists past day seven.",
      medicines: [
        {
          name: "Paracetamol 500mg",
          dosage: "1 tablet",
          duration: "5 days",
          instructions: "Every 6 hours after food, only if temperature is above 100°F.",
        },
        {
          name: "Oral rehydration salts",
          dosage: "1 sachet",
          duration: "3 days",
          instructions: "Dissolve in 200ml water, twice daily.",
        },
      ],
      attachments: [
        { label: "CBC report", kind: "lab" },
        { label: "Prescription", kind: "prescription" },
      ],
    },
    {
      id: "v2",
      doctor: "Dr. Aisha Rahman",
      specialty: "Dentist",
      photo: doc1,
      date: "19 Jul 2026",
      complaint: "Sensitivity in lower left molar",
      complaintDetail:
        "Sharp pain on cold drinks for two weeks, localised to the lower left second molar. No swelling, no night pain.",
      status: "Completed",
      notes:
        "Early enamel wear with exposed dentine. Desensitising varnish applied and a fluoride course started. Night guard recommended for grinding.",
      medicines: [
        {
          name: "Sensodyne Repair",
          dosage: "Twice daily",
          duration: "8 weeks",
          instructions: "Brush gently for two minutes; avoid rinsing immediately after.",
        },
      ],
      attachments: [{ label: "Dental X-ray", kind: "image" }],
    },
    {
      id: "v3",
      doctor: "Dr. Lena Haq",
      specialty: "Dermatologist",
      photo: doc3,
      date: "28 Jun 2026",
      complaint: "Hormonal acne along jawline",
      complaintDetail:
        "Recurring inflamed papules along the jawline and chin, worse in the week before menstruation, with post-inflammatory pigmentation.",
      status: "Completed",
      notes:
        "Started on a topical retinoid at night with strict SPF in the morning. Reviewed skincare routine and removed two comedogenic products.",
      medicines: [
        {
          name: "Adapalene 0.1%",
          dosage: "Pea-sized amount",
          duration: "12 weeks",
          instructions: "Apply at night on dry skin, three nights a week to start.",
        },
        {
          name: "Mineral SPF 50",
          dosage: "Two fingers",
          duration: "Ongoing",
          instructions: "Every morning, reapply every 3 hours outdoors.",
        },
      ],
      attachments: [{ label: "Treatment plan", kind: "prescription" }],
    },
    {
      id: "v4",
      doctor: "Dr. Imran Qadri",
      specialty: "Pediatrician",
      photo: doc4,
      date: "11 May 2026",
      complaint: "Annual wellness check",
      complaintDetail:
        "Routine adult wellness screening — vitals, weight trend, vitamin D and thyroid panel with a lifestyle review.",
      status: "Completed",
      notes:
        "All vitals within range. Vitamin D insufficient at 18 ng/mL; weekly supplement started. Recheck in three months.",
      medicines: [
        {
          name: "Vitamin D3 50,000 IU",
          dosage: "1 capsule",
          duration: "8 weeks",
          instructions: "Once weekly with the heaviest meal of the day.",
        },
      ],
      attachments: [
        { label: "Vitals summary", kind: "lab" },
        { label: "Thyroid panel", kind: "lab" },
      ],
    },
  ],
  prescriptions: [
    {
      id: "p1",
      doctor: "Dr. Omar Shafiq",
      date: "02 Aug 2026",
      photo: doc2,
      refillsLeft: 2,
      medicines: [
        {
          name: "Paracetamol 500mg",
          dosage: "1 tablet · every 6h",
          duration: "5 days",
          instructions: "Take after food, only above 100°F. Do not exceed 4 tablets a day.",
        },
        {
          name: "ORS sachets",
          dosage: "1 sachet · twice daily",
          duration: "3 days",
          instructions: "Dissolve in 200ml of clean water and sip through the day.",
        },
      ],
    },
    {
      id: "p2",
      doctor: "Dr. Lena Haq",
      date: "28 Jun 2026",
      photo: doc3,
      refillsLeft: 1,
      medicines: [
        {
          name: "Adapalene 0.1% gel",
          dosage: "Pea-sized · nightly",
          duration: "12 weeks",
          instructions: "Start three nights a week, build up as tolerated. Expect purging weeks 2-4.",
        },
      ],
    },
    {
      id: "p3",
      doctor: "Dr. Imran Qadri",
      date: "11 May 2026",
      photo: doc4,
      refillsLeft: 3,
      medicines: [
        {
          name: "Vitamin D3 50,000 IU",
          dosage: "1 capsule · weekly",
          duration: "8 weeks",
          instructions: "Same day each week with a fatty meal for absorption.",
        },
      ],
    },
    {
      id: "p4",
      doctor: "Dr. Aisha Rahman",
      date: "19 Jul 2026",
      photo: doc1,
      refillsLeft: 0,
      medicines: [
        {
          name: "Fluoride rinse 0.05%",
          dosage: "10ml · nightly",
          duration: "6 weeks",
          instructions: "Swish for one minute before bed; nothing to eat or drink for 30 minutes.",
        },
      ],
    },
  ],
  labs: [
    {
      id: "l1",
      test: "Complete Blood Count",
      date: "03 Aug 2026",
      status: "Ready",
      lab: "Caddy Diagnostics · Clifton",
      summary: "Mild lymphocytosis consistent with a resolving viral illness. Platelets normal.",
      values: [
        { name: "Haemoglobin", value: "12.9 g/dL", range: "12.0 – 15.5", flag: "normal" },
        { name: "WBC", value: "11.8 ×10⁹/L", range: "4.0 – 11.0", flag: "high" },
        { name: "Platelets", value: "241 ×10⁹/L", range: "150 – 410", flag: "normal" },
      ],
    },
    {
      id: "l2",
      test: "Vitamin D (25-OH)",
      date: "12 May 2026",
      status: "Ready",
      lab: "Northside Labs",
      summary: "Insufficient. Weekly high-dose supplementation started with a 3-month recheck.",
      values: [{ name: "25-OH Vitamin D", value: "18 ng/mL", range: "30 – 100", flag: "low" }],
    },
    {
      id: "l3",
      test: "Thyroid Panel (TSH, T3, T4)",
      date: "12 May 2026",
      status: "Ready",
      lab: "Northside Labs",
      summary: "Euthyroid. No treatment needed; repeat only if symptoms return.",
      values: [
        { name: "TSH", value: "2.1 mIU/L", range: "0.4 – 4.0", flag: "normal" },
        { name: "Free T4", value: "1.2 ng/dL", range: "0.8 – 1.8", flag: "normal" },
      ],
    },
    {
      id: "l4",
      test: "Dengue NS1 Antigen",
      date: "Today",
      status: "Processing",
      lab: "Caddy Diagnostics · Clifton",
      summary: "Sample collected this morning — results usually land within 6 hours.",
      values: [],
    },
    {
      id: "l5",
      test: "Lipid Profile",
      date: "11 May 2026",
      status: "Ready",
      lab: "Caddy Diagnostics · Clifton",
      summary: "Borderline LDL. Diet-first plan agreed, recheck in six months.",
      values: [
        { name: "LDL", value: "131 mg/dL", range: "< 130", flag: "high" },
        { name: "HDL", value: "58 mg/dL", range: "> 50", flag: "normal" },
      ],
    },
    {
      id: "l6",
      test: "Dental Panoramic X-ray",
      date: "19 Jul 2026",
      status: "Ready",
      lab: "Caddy Smile Studio",
      summary: "No caries or bone loss. Enamel wear noted on lower molars from grinding.",
      values: [],
    },
  ],
};

export const NEW_PATIENT: ProfileMock = {
  patient: {
    name: "Zoya Hameed",
    memberSince: "Joined today",
    tier: "New Patient",
    avatar: patientAvatar,
    city: "Karachi · Clifton",
    bloodGroup: "Not added yet",
  },
  stats: POPULATED.stats.map((s) => ({
    ...s,
    value: 0,
    hint:
      s.key === "visits"
        ? "your first is coming"
        : s.key === "appointments"
          ? "book one in seconds"
          : s.key === "prescriptions"
            ? "nothing on file yet"
            : "no reports yet",
  })),
  streak: [],
  currentStreak: 0,
  bestStreak: 0,
  appointment: null,
  visits: [],
  prescriptions: [],
  labs: [],
};

export function getProfileMock(state: MockState): ProfileMock {
  return state === "new" ? NEW_PATIENT : POPULATED;
}

export const STREAK_COPY = (days: number) => {
  if (days >= 14) return "Two weeks strong — Caddy is genuinely showing off about you.";
  if (days >= 7) return "A full week logged. This is the habit sticking, not luck.";
  if (days >= 3) return `${days} days in a row. Momentum looks good on you.`;
  if (days >= 1) return "Streak started. Log tomorrow and Caddy will keep the flame lit.";
  return "No streak yet — one check-in is all it takes to start one.";
};
