"use client";

import Image from "next/image";
import { OutcomePageShell } from "@/components/OutcomePageShell";
import { useLocale, useMessages } from "@/lib/i18n";
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
  const t = useMessages();
  const { locale } = useLocale();
  const insurer = patient.insurer as Insurer;
  const consultant = patient.consultant as ConsultantName;
  const profile = CONSULTANT_PROFILES[consultant];
  const localized = profile ? t.careTeam.consultants[profile.name] : null;
  const languageJoin = locale === "zh-CN" ? "、" : ", ";

  return (
    <OutcomePageShell
      compactHeadline
      headlineSpaced
      headline={
        <span className="block text-[1.872em]">
          {t.careTeam.headlineYour}{" "}
          <span className="text-[1.15em] font-extrabold text-brand-teal">
            {t.careTeam.headlineInsurer}
          </span>{" "}
          {t.careTeam.headlineAnd}{" "}
          <span className="text-[1.15em] font-extrabold text-brand-teal">
            {t.careTeam.headlineSpecialist}
          </span>
          {t.careTeam.headlineForSurgery ? ` ${t.careTeam.headlineForSurgery}` : ""}
        </span>
      }
      onBack={onBack}
      onNext={onNewPatient}
      nextLabel={t.careTeam.nextLabel}
      backLabel={t.careTeam.backLabel}
    >
      <div className="flex min-h-0 flex-col gap-3 landscape:gap-3 sm:gap-4">
        <div className="flex shrink-0 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
          <div className="shrink-0 text-left">
            <p className="text-[0.9rem] font-bold uppercase tracking-wide text-slate-500">
              {t.careTeam.yourInsurer}
            </p>
            <p className="mt-0.5 text-[1.2rem] font-bold text-brand-navy sm:text-[1.35rem]">
              {insurer}
            </p>
          </div>
          <Image
            src={insurerLogoPath(insurer)}
            alt={`${insurer} logo`}
            width={384}
            height={144}
            className="h-auto max-h-[5.75rem] w-auto max-w-[240px] shrink-0 object-contain sm:max-h-[7.2rem] sm:max-w-[288px]"
          />
        </div>

        {profile && localized && (
          <div className="min-h-0 shrink rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <p className="text-center text-xs font-bold uppercase tracking-wide text-slate-500">
              {t.careTeam.yourSpecialist}
            </p>
            <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-start">
              <Image
                src={profile.photoPath}
                alt={profile.name}
                width={182}
                height={228}
                className="h-[10.8rem] w-[9.6rem] shrink-0 rounded-xl object-cover object-top shadow-md sm:h-48 sm:w-[10.8rem]"
              />
              <div className="min-w-0 max-w-xl text-center text-[1.728em] leading-snug sm:text-left">
                <h3 className="text-[1.755rem] font-bold text-brand-navy">{profile.name}</h3>
                <p className="mt-0.5 text-[1.1375rem] font-semibold text-brand-teal">
                  {localized.rank}
                </p>
                <p className="text-sm font-medium text-slate-600">{t.careTeam.nhgEyeInstitute}</p>
                <p className="text-sm text-slate-600">{localized.department}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-700">{t.careTeam.clinicalInterests} </span>
                  {localized.clinicalInterests}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  <span className="font-semibold">{t.careTeam.languages} </span>
                  {localized.languages.join(languageJoin)}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{localized.about}</p>
                <p className="mt-1.5 text-[10px] leading-snug text-slate-400">
                  {t.careTeam.sourcePrefix}{" "}
                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-teal underline"
                  >
                    {localized.sourceLabel}
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
