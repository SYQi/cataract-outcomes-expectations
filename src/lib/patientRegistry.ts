export const INSURERS = [
  "AIA",
  "Great Eastern",
  "Prudential",
  "Singlife",
  "NTUC Income",
  "Raffles",
  "HSBC",
] as const;

export type Insurer = (typeof INSURERS)[number];

export const CONSULTANTS = [
  "Dr James Pan",
  "Dr Lilian Koh",
  "Dr Louis Lim",
  "Dr Annie Lai",
  "Dr Muhammad Amir Tan",
  "Dr Jane Lim",
  "Dr Elizabeth Chen",
  "Dr Soh Yu Qiang",
  "Dr Mohammad Jawad Abdul-Nabi",
  "Dr Lim Rongxuan",
] as const;

export type ConsultantName = (typeof CONSULTANTS)[number];

export type ConsultantProfile = {
  name: ConsultantName;
  slug: string;
  photoPath: string;
  rank: string;
  department: string;
  clinicalInterests: string;
  languages: string[];
  about: string;
  qualifications: string;
  profileUrl: string;
};

export const CONSULTANT_PROFILES: Record<ConsultantName, ConsultantProfile> = {
  "Dr James Pan": {
    name: "Dr James Pan",
    slug: "james-pan",
    photoPath: "/consultants/james-pan.jpg",
    rank: "Senior Consultant",
    department: "Ophthalmology, Woodlands Hospital",
    clinicalInterests: "Cornea and external eye diseases, cataract surgery, comprehensive ophthalmology",
    languages: ["English", "Mandarin"],
    about:
      "Dr James Pan practices ophthalmology with special interests in cornea and external eye diseases, cataract surgery and comprehensive ophthalmology. He serves as Clinical Senior Lecturer at NUS Yong Loo Lin School of Medicine and NTU Lee Kong Chian School of Medicine.",
    qualifications:
      "MBBS (NUS), M Med (Ophthalmology), FAMS, FRCSEd (Ophth), MRCSEd (Ophth)",
    profileUrl: "https://www.nhghealth.com.sg/find-care/specialist/james-pan",
  },
  "Dr Lilian Koh": {
    name: "Dr Lilian Koh",
    slug: "lilian-koh",
    photoPath: "/consultants/lilian-koh.jpg",
    rank: "Senior Consultant",
    department: "Ophthalmology, Woodlands Hospital",
    clinicalInterests: "Medical retina, uveitis, ocular immunology, cataracts, general ophthalmology",
    languages: ["English", "Mandarin"],
    about:
      "Dr Koh Lilian practices ophthalmology with special interests in medical retina, uveitis, ocular immunology and inflammation, cataracts, and general ophthalmology. She is a Clinical Lecturer at NUS and NTU medical schools.",
    qualifications: "MBBS (NUS), M Med (Ophthalmology), FRCOphth, FAMS",
    profileUrl: "https://www.nhghealth.com.sg/find-care/specialist/koh-lilian",
  },
  "Dr Louis Lim": {
    name: "Dr Louis Lim",
    slug: "louis-lim",
    photoPath: "/consultants/louis-lim.jpg",
    rank: "Consultant",
    department: "Ophthalmology, Woodlands Hospital",
    clinicalInterests: "Comprehensive ophthalmology, cataract, medical retina, vitreo-retinal surgery",
    languages: ["English", "Hokkien", "Mandarin"],
    about:
      "Dr Louis Lim is a Consultant with the Department of Ophthalmology at Woodlands Hospital and the National Healthcare Group Eye Institute.",
    qualifications: "MBBS (NUS)",
    profileUrl: "https://www.nhghealth.com.sg/find-care/specialist/louis-lim",
  },
  "Dr Annie Lai": {
    name: "Dr Annie Lai",
    slug: "annie-lai",
    photoPath: "/consultants/annie-lai.jpg",
    rank: "Senior Consultant",
    department: "Ophthalmology, Woodlands Hospital",
    clinicalInterests: "Neuro-ophthalmology, cataract, comprehensive ophthalmology",
    languages: ["English", "Cantonese", "Mandarin"],
    about:
      "Dr Annie Lai practices ophthalmology with special interests in neuro-ophthalmology, cataracts, and general ophthalmology. She serves as Clinical Lecturer at NUS Yong Loo Lin School of Medicine.",
    qualifications: "MBBS, M Med (Ophthalmology), FAMS",
    profileUrl: "https://www.nhghealth.com.sg/find-care/specialist/annie-lai",
  },
  "Dr Muhammad Amir Tan": {
    name: "Dr Muhammad Amir Tan",
    slug: "muhammad-amir-tan",
    photoPath: "/consultants/muhammad-amir-tan.jpg",
    rank: "Consultant",
    department: "Ophthalmology, Woodlands Hospital",
    clinicalInterests: "Cornea, cataract, comprehensive ophthalmology",
    languages: ["English", "Malay", "Mandarin"],
    about:
      "Dr Amir is a Consultant at the Department of Ophthalmology, Woodlands Hospital, and a Visiting Consultant with Tan Tock Seng Hospital and Khoo Teck Puat Hospital.",
    qualifications: "MBBS (NUS), M Med (Ophthalmology), FRCOphth, FAMS",
    profileUrl: "https://www.nhghealth.com.sg/find-care/specialist/muhammad-amir-bin-ismail",
  },
  "Dr Jane Lim": {
    name: "Dr Jane Lim",
    slug: "jane-lim",
    photoPath: "/consultants/jane-lim.jpg",
    rank: "Consultant",
    department: "Ophthalmology, Woodlands Hospital",
    clinicalInterests: "Cataract and comprehensive ophthalmology",
    languages: ["English", "Mandarin"],
    about:
      "Dr Jane Lim is a Consultant Ophthalmologist at Woodlands Hospital and the National Healthcare Group Eye Institute.",
    qualifications: "MBBS (NUS), FAMS",
    profileUrl: "https://www.nhghealth.com.sg/find-care/specialist/jane-lim-sujuan",
  },
  "Dr Elizabeth Chen": {
    name: "Dr Elizabeth Chen",
    slug: "elizabeth-chen",
    photoPath: "/consultants/elizabeth-chen.jpg",
    rank: "Associate Consultant",
    department: "Ophthalmology, Woodlands Hospital",
    clinicalInterests: "Glaucoma",
    languages: ["English", "Mandarin"],
    about:
      "Dr Elizabeth Chen is an Associate Consultant at the Department of Ophthalmology, Woodlands Hospital and National Healthcare Group Eye Institute.",
    qualifications: "MBBS (NUS)",
    profileUrl: "https://www.nhghealth.com.sg/find-care/specialist/wh-Elizabeth-Chen",
  },
  "Dr Soh Yu Qiang": {
    name: "Dr Soh Yu Qiang",
    slug: "soh-yu-qiang",
    photoPath: "/consultants/soh-yu-qiang.jpg",
    rank: "Consultant",
    department: "Ophthalmology, Woodlands Hospital",
    clinicalInterests: "Surgical retina, medical retina, scleral intraocular lens fixation",
    languages: ["English", "Hokkien", "Mandarin"],
    about:
      "Dr Soh Yu Qiang is a Consultant with the Department of Ophthalmology at Woodlands Hospital and National Healthcare Group Eye Institute, with interests in retinal surgery and complex retinal pathologies.",
    qualifications: "MBBS (NUS), M Med (Ophthalmology), FRCOphth",
    profileUrl: "https://www.nhghealth.com.sg/find-care/specialist/soh-yu-qiang",
  },
  "Dr Mohammad Jawad Abdul-Nabi": {
    name: "Dr Mohammad Jawad Abdul-Nabi",
    slug: "mohammad-jawad",
    photoPath: "/consultants/mohammad-jawad.jpg",
    rank: "Senior Consultant",
    department: "Ophthalmology, Woodlands Hospital",
    clinicalInterests: "Comprehensive ophthalmology",
    languages: ["Arabic", "English"],
    about:
      "Dr Abdul-Nabi graduated from Glasgow University and trained in ophthalmology at the Tennent Institute in Glasgow and Manchester Royal Eye Hospital in the UK.",
    qualifications: "MBChB (Glasgow), FRCS (Ophth)",
    profileUrl: "https://www.nhghealth.com.sg/find-care/specialist/WH-Mohammad-Jawad-Abdul-Nabi",
  },
  "Dr Lim Rongxuan": {
    name: "Dr Lim Rongxuan",
    slug: "lim-rongxuan",
    photoPath: "/consultants/lim-rongxuan.jpg",
    rank: "Senior Consultant",
    department: "Ophthalmology, Woodlands Hospital",
    clinicalInterests: "Glaucoma, cataract, general ophthalmology",
    languages: ["English", "Mandarin"],
    about:
      "Dr Lim Rongxuan graduated from the University of Cambridge with triple first class honours and practices ophthalmology with interests in glaucoma and cataract surgery.",
    qualifications: "MB BChir (Cambridge), FRCOphth",
    profileUrl: "https://www.nhghealth.com.sg/find-care/specialist/lim-rongxuan",
  },
};

import type { VisualAcuity } from "@/lib/va";

/** Logo file under /public/insurers/ (official brand assets). */
export function insurerLogoPath(insurer: Insurer): string {
  const file: Record<Insurer, string> = {
    AIA: "aia.jpg",
    "Great Eastern": "great-eastern.webp",
    Prudential: "prudential.png",
    Singlife: "singlife.png",
    "NTUC Income": "ntuc-income.png",
    Raffles: "raffles.png",
    HSBC: "hsbc.svg",
  };
  return `/insurers/${file[insurer]}`;
}

export type PatientIntake = {
  name: string;
  nric: string;
  dateTime: string;
  visualAcuity: VisualAcuity | "";
  insurer: Insurer | "";
  consultant: ConsultantName | "";
};

export const EMPTY_PATIENT_INTAKE: PatientIntake = {
  name: "",
  nric: "",
  dateTime: "",
  visualAcuity: "",
  insurer: "",
  consultant: "",
};
