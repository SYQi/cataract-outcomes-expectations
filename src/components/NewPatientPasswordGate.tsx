"use client";

import { useState, type FormEvent } from "react";

const NEW_PATIENT_PASSWORD = "123";

type NewPatientPasswordGateProps = {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

export function NewPatientPasswordGate({ open, onCancel, onSuccess }: NewPatientPasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === NEW_PATIENT_PASSWORD) {
      setPassword("");
      setError(false);
      onSuccess();
      return;
    }
    setError(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">
          Staff access
        </p>
        <h3 className="mt-1 text-lg font-bold text-brand-navy">Start new patient</h3>
        <p className="mt-1 text-sm text-slate-500">Enter the staff password to continue.</p>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            autoFocus
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
            placeholder="••••"
          />
        </label>
        {error && (
          <p className="mt-2 text-sm font-medium text-red-600">Incorrect password. Please try again.</p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setPassword("");
              setError(false);
              onCancel();
            }}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-brand-navy px-4 py-3 text-sm font-semibold text-white hover:bg-brand-navy/90"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
