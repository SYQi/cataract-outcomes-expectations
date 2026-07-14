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
        <span className="block">
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
      <div className="flex min-h-0 flex-col gap-4">
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="shrink-0 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
            Your insurer
          </p>
          <p className="mt-1 shrink-0 text-center text-lg font-bold text-brand-navy">{insurer}</p>
          <div className="mt-3 flex min-h-[9rem] items-center justify-center px-2 sm:min-h-[11rem]">
            <Image
              src={insurerLogoPath(insurer)}
              alt={`${insurer} logo`}
              width={480}
              height={200}
              className="h-auto max-h-full w-full max-w-full object-contain"
            />
          </div>
        </div>

        {profile && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-center text-xs font-bold uppercase tracking-wide text-slate-500">
              Your specialist consultant
            </p>
            <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Image
                src={profile.photoPath}
                alt={profile.name}
                width={140}
                height={175}
                className="h-36 w-28 shrink-0 rounded-xl object-cover object-top shadow-md sm:h-40 sm:w-32"
              />
              <div className="min-w-0 text-center text-[1.2em] sm:text-left">
                <h3 className="text-lg font-bold text-brand-navy">{profile.name}</h3>
                <p className="mt-0.5 text-sm font-semibold text-brand-teal">{profile.rank}</p>
                <p className="text-sm text-slate-600">{profile.department}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-700">Clinical interests: </span>
                  {profile.clinicalInterests}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  <span className="font-semibold">Languages: </span>
                  {profile.languages.join(", ")}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{profile.about}</p>
                <p className="mt-2 text-[10px] leading-snug text-slate-400">
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
