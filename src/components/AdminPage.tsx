"use client";

import {
  CONSULTANTS,
  INSURERS,
  type PatientIntake,
} from "@/lib/patientRegistry";
import { VA_OPTIONS, type VisualAcuity } from "@/lib/va";
import { WhLogo } from "@/components/WhLogo";

type AdminPageProps = {
  patient: PatientIntake;
  onChange: (patient: PatientIntake) => void;
  onContinue: () => void;
};

export function AdminPage({ patient, onChange, onContinue }: AdminPageProps) {
  const valid =
    patient.name.trim().length > 0 &&
    patient.nric.trim().length > 0 &&
    patient.visualAcuity !== "" &&
    patient.insurer !== "" &&
    patient.consultant !== "";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex justify-center">
        <WhLogo size="md" />
      </div>
      <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand-teal">
        Staff only
      </p>
      <h2 className="mt-1 text-center text-xl font-bold text-brand-navy sm:text-2xl">
        Administrator Page
      </h2>
      <p className="mt-1 text-center text-sm text-slate-500">
        Enter patient details for the session. The patient will verify these on the next screen.
      </p>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Patient full name</span>
          <input
            type="text"
            value={patient.name}
            onChange={(e) => onChange({ ...patient, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            placeholder="Enter patient name"
            autoComplete="name"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">NRIC</span>
          <input
            type="text"
            value={patient.nric}
            onChange={(e) => onChange({ ...patient, nric: e.target.value.toUpperCase() })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base uppercase focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            placeholder="e.g. S1234567A"
            autoComplete="off"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Current visual acuity</span>
          <select
            value={patient.visualAcuity}
            onChange={(e) =>
              onChange({ ...patient, visualAcuity: e.target.value as VisualAcuity | "" })
            }
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          >
            <option value="">Select visual acuity</option>
            {VA_OPTIONS.map((va) => (
              <option key={va} value={va}>
                {va}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Affected eye, with glasses if worn.
          </p>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Insurer</span>
          <select
            value={patient.insurer}
            onChange={(e) =>
              onChange({ ...patient, insurer: e.target.value as PatientIntake["insurer"] })
            }
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          >
            <option value="">Select insurer</option>
            {INSURERS.map((insurer) => (
              <option key={insurer} value={insurer}>
                {insurer}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Specialist consultant in charge</span>
          <select
            value={patient.consultant}
            onChange={(e) =>
              onChange({ ...patient, consultant: e.target.value as PatientIntake["consultant"] })
            }
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          >
            <option value="">Select consultant</option>
            {CONSULTANTS.map((consultant) => (
              <option key={consultant} value={consultant}>
                {consultant}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Date &amp; time (GMT+8)</span>
          <input
            type="text"
            readOnly
            value={patient.dateTime}
            className="mt-1 w-full cursor-default rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-600"
          />
        </label>
      </div>

      <button
        type="button"
        disabled={!valid}
        onClick={onContinue}
        className="mt-8 w-full rounded-xl bg-brand-navy px-6 py-4 text-base font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue to patient verification
      </button>
    </section>
  );
}
