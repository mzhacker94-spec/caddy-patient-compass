import doc1 from "@/assets/doc-1.jpg";
import doc2 from "@/assets/doc-2.jpg";
import doc3 from "@/assets/doc-3.jpg";
import doc4 from "@/assets/doc-4.jpg";

export type Specialization = {
  id: string;
  label: string;
  icon: "tooth" | "stethoscope" | "sparkles" | "baby" | "heart" | "eye";
  tint: "care" | "ember" | "gold";
};

export const SPECIALIZATIONS: Specialization[] = [
  { id: "dentist", label: "Dentist", icon: "tooth", tint: "care" },
  { id: "physician", label: "General Physician", icon: "stethoscope", tint: "ember" },
  { id: "skin", label: "Skin Specialist", icon: "sparkles", tint: "gold" },
  { id: "pediatric", label: "Pediatrics", icon: "baby", tint: "care" },
  { id: "cardio", label: "Cardiology", icon: "heart", tint: "ember" },
  { id: "eye", label: "Eye Care", icon: "eye", tint: "gold" },
];

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  fee: string;
  next: string;
  experience: string;
  bio: string;
  tags: string[];
  photo: string;
};

export const DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Aisha Rahman",
    specialty: "Dentist",
    clinic: "Caddy Smile Studio",
    rating: 4.9,
    fee: "$28",
    next: "Today 4:30 PM",
    experience: "9 yrs",
    bio: "Gentle cosmetic and restorative dentistry — veneers, whitening and painless root canals with same-day crowns.",
    tags: ["Painless care", "Same-day crowns", "Kids friendly"],
    photo: doc1,
  },
  {
    id: "d2",
    name: "Dr. Omar Shafiq",
    specialty: "General Physician",
    clinic: "Northside Care Clinic",
    rating: 4.8,
    fee: "$22",
    next: "Today 6:00 PM",
    experience: "12 yrs",
    bio: "Everyday illness, fever, diabetes and blood-pressure management with clear follow-up plans and lab reviews.",
    tags: ["Diabetes care", "Lab review", "Video visits"],
    photo: doc2,
  },
  {
    id: "d3",
    name: "Dr. Lena Haq",
    specialty: "Dermatologist",
    clinic: "Glow Skin Lab",
    rating: 4.7,
    fee: "$34",
    next: "Tomorrow 11:00 AM",
    experience: "7 yrs",
    bio: "Acne, pigmentation and hair-fall treatment plans built around your skin type, plus laser and peel sessions.",
    tags: ["Acne plans", "Laser", "Hair fall"],
    photo: doc3,
  },
  {
    id: "d4",
    name: "Dr. Imran Qadri",
    specialty: "Pediatrician",
    clinic: "Little Hearts Clinic",
    rating: 5.0,
    fee: "$26",
    next: "Tomorrow 9:15 AM",
    experience: "15 yrs",
    bio: "Newborn checkups, vaccinations and growth tracking — calm consults that parents actually leave reassured by.",
    tags: ["Vaccination", "Newborn care", "Growth tracking"],
    photo: doc4,
  },
];
