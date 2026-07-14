"use client";

import Image from "next/image";
import { OutcomePageShell } from "@/components/OutcomePageShell";
import {
  CONSULTANT_PROFILES,
  insurerLogoPath,
  type ConsultantName,
  type Insurer,
  type PatientIntake,
} from "@/lib/patientRegistry";

type CareTeamPageProps = {
  patient: PatientIntake;
  onBack: () => void;
  onNewPatient: () => void;
};

export function CareTeamPage({ patient, onBack, onNewPatient }: CareTeamPageProps) {
  const insurer = patient.insurer as Insurer;
  const consultant = patient.consultant as ConsultantName;
  const profile = CONSULTANT_PROFILES[consultant];

  return (
    <OutcomePageShell
      headline={
        <span className="block text-[1.3em]">
          Your{" "}
          <span className="text-[1.15em] font-extrabold text-brand-teal">Insurer</span> and{" "}
          <span className="text-[1.15em] font-extrabold text-brand-teal">Specialist</span> for
          Cataract Surgery
        </span>
      }
      onBack={onBack}
      onNext={onNewPatient}
      nextLabel="New patient"
      backLabel="← Quality of life"
    >
      <div className="flex min-h-0 flex-col gap-3 landscape:gap-3 sm:gap-4">
        <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="min-w-0 shrink-0 text-left">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Your insurer</p>
            <p className="mt-0.5 text-base font-bold text-brand-navy sm:text-lg">{insurer}</p>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-end">
            <Image
              src={insurerLogoPath(insurer)}
              alt={`${insurer} logo`}
              width={384}
              height={144}
              className="h-auto max-h-[4.8rem] w-auto max-w-[200px] object-contain sm:max-h-24 sm:max-w-[240px]"
            />
          </div>
        </div>

        {profile && (
          <div className="min-h-0 shrink rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <p className="text-center text-xs font-bold uppercase tracking-wide text-slate-500">
              Your specialist consultant
            </p>
            <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              <Image
                src={profile.photoPath}
                alt={profile.name}
                width={182}
                height={228}
                className="h-36 w-32 shrink-0 rounded-xl object-cover object-top shadow-md sm:h-40 sm:w-36"
              />
              <div className="min-w-0 text-center text-[1.728em] leading-snug sm:text-left">
                <h3 className="text-[1.4625rem] font-bold text-brand-navy">{profile.name}</h3>
                <p className="mt-0.5 text-[1.1375rem] font-semibold text-brand-teal">{profile.rank}</p>
                <p className="text-sm text-slate-600">{profile.department}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-700">Clinical interests: </span>
                  {profile.clinicalInterests}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  <span className="font-semibold">Languages: </span>
                  {profile.languages.join(", ")}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{profile.about}</p>
                <p className="mt-1.5 text-[10px] leading-snug text-slate-400">
                  Source:{" "}
                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-teal underline"
                  >
                    NHG Health specialist profile
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </OutcomePageShell>
  );
}
