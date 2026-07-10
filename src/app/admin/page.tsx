"use client";

import { useState, type FormEvent } from "react";
import { PAGE_LABELS, type PatientSessionRecord } from "@/lib/sessionAnalytics";

export default function AdminSessionsPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<PatientSessionRecord[]>([]);
  const [storage, setStorage] = useState("");

  const loadSessions = async (pwd: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/sessions/export?password=${encodeURIComponent(pwd)}&format=json`);
      if (res.status === 401) {
        setError("Incorrect password");
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        setError("Failed to load sessions");
        return;
      }
      const data = await res.json();
      setSessions(data.sessions ?? []);
      setStorage(data.storage ?? "");
      setAuthed(true);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    await loadSessions(password);
  };

  const downloadCsv = () => {
    window.location.href = `/api/sessions/export?password=${encodeURIComponent(password)}&format=csv`;
  };

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <form onSubmit={handleLogin} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">Staff only</p>
          <h1 className="mt-1 text-xl font-bold text-brand-navy">Session analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Download patient visit logs and time-on-page for post-launch evaluation.
          </p>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3"
              placeholder="••••"
            />
          </label>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-brand-navy px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Loading…" : "Open dashboard"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">Staff only</p>
          <h1 className="text-2xl font-bold text-brand-navy">Session analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            {sessions.length} session{sessions.length === 1 ? "" : "s"} · storage: {storage || "—"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => loadSessions(password)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={downloadCsv}
            className="rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white"
          >
            Download Excel (CSV)
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Open the CSV in Excel or Google Sheets. Columns include name, NRIC, form date/time, and seconds
        spent on each page.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Patient</th>
              <th className="px-3 py-2">NRIC</th>
              <th className="px-3 py-2">Form date/time</th>
              <th className="px-3 py-2">Total (s)</th>
              <th className="px-3 py-2">Details</th>
              <th className="px-3 py-2">Assess</th>
              <th className="px-3 py-2">VA</th>
              <th className="px-3 py-2">Refract</th>
              <th className="px-3 py-2">Compl</th>
              <th className="px-3 py-2">PROMS</th>
              <th className="px-3 py-2">Done</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 && (
              <tr>
                <td colSpan={11} className="px-3 py-8 text-center text-slate-400">
                  No sessions recorded yet.
                </td>
              </tr>
            )}
            {sessions.map((s) => (
              <tr key={s.sessionId} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium text-slate-800">{s.patientName || "—"}</td>
                <td className="px-3 py-2 font-mono text-xs">{s.nric || "—"}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{s.formDateTime || "—"}</td>
                <td className="px-3 py-2 font-semibold">{s.totalSeconds}</td>
                <td className="px-3 py-2">{s.pageSeconds.details}</td>
                <td className="px-3 py-2">{s.pageSeconds.assessment}</td>
                <td className="px-3 py-2">{s.pageSeconds.va}</td>
                <td className="px-3 py-2">{s.pageSeconds.refraction}</td>
                <td className="px-3 py-2">{s.pageSeconds.complications}</td>
                <td className="px-3 py-2">{s.pageSeconds.proms}</td>
                <td className="px-3 py-2">{s.completed ? "Yes" : "Partial"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
        <p className="font-semibold text-slate-700">Page timing keys</p>
        <ul className="mt-1 list-inside list-disc">
          {Object.entries(PAGE_LABELS).map(([key, label]) => (
            <li key={key}>
              <span className="font-mono">{key}</span> — {label}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
