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
      <div className="flex min-h-0 flex-col gap-3 landscape:grid landscape:grid-cols-2 landscape:gap-2 sm:gap-4">
        <div className="flex shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm landscape:p-2 sm:p-4">
          <p className="shrink-0 text-center text-xs font-bold uppercase tracking-wide text-slate-500 landscape:text-[10px]">
            Your insurer
          </p>
          <p className="mt-0.5 shrink-0 text-center text-base font-bold text-brand-navy landscape:text-sm sm:text-lg">
            {insurer}
          </p>
          <div className="mt-2 flex h-[5.75rem] items-center justify-center px-2 landscape:mt-1 landscape:h-[6.6rem] sm:h-[7.2rem]">
            <Image
              src={insurerLogoPath(insurer)}
              alt={`${insurer} logo`}
              width={384}
              height={144}
              className="h-auto max-h-full w-auto max-w-[317px] object-contain landscape:max-w-[264px] sm:max-w-[374px]"
            />
          </div>
        </div>

        {profile && (
          <div className="min-h-0 shrink rounded-2xl border border-slate-200 bg-white p-3 shadow-sm landscape:p-2 sm:p-4">
            <p className="text-center text-xs font-bold uppercase tracking-wide text-slate-500 landscape:text-[10px]">
              Your specialist consultant
            </p>
            <div className="mt-3 flex flex-col items-center gap-3 landscape:mt-1.5 landscape:flex-row landscape:items-start landscape:gap-2 sm:flex-row sm:items-start">
              <Image
                src={profile.photoPath}
                alt={profile.name}
                width={182}
                height={228}
                className="h-[10.8rem] w-[9.6rem] shrink-0 rounded-xl object-cover object-top shadow-md landscape:h-[7.2rem] landscape:w-24 sm:h-48 sm:w-[10.8rem]"
              />
              <div className="min-w-0 text-center text-[1.728em] leading-snug landscape:text-[1.1em] sm:text-left">
                <h3 className="text-[1.4625rem] font-bold text-brand-navy landscape:text-base">{profile.name}</h3>
                <p className="mt-0.5 text-[1.1375rem] font-semibold text-brand-teal landscape:text-sm">{profile.rank}</p>
                <p className="text-sm text-slate-600 landscape:text-xs">{profile.department}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 landscape:mt-0.5 landscape:line-clamp-2 landscape:text-[10px]">
                  <span className="font-semibold text-slate-700">Clinical interests: </span>
                  {profile.clinicalInterests}
                </p>
                <p className="mt-1 text-xs text-slate-500 landscape:mt-0.5 landscape:text-[10px]">
                  <span className="font-semibold">Languages: </span>
                  {profile.languages.join(", ")}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 landscape:hidden">{profile.about}</p>
                <p className="mt-1.5 text-[10px] leading-snug text-slate-400 landscape:hidden">
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
