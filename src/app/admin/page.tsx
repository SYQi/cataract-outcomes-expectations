"use client";

import { useState, type FormEvent } from "react";
import {
  PAGE_LABELS,
  isUpgradeDecision,
  type PatientSessionRecord,
  type UpgradeDecision,
} from "@/lib/sessionAnalytics";

export default function AdminSessionsPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<PatientSessionRecord[]>([]);
  const [storage, setStorage] = useState("");
  const [clearing, setClearing] = useState(false);
  const [savingUpgradeId, setSavingUpgradeId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const setUpgradeDecision = async (sessionId: string, decision: UpgradeDecision | null) => {
    setSavingUpgradeId(sessionId);
    setError("");
    try {
      const res = await fetch("/api/sessions/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, sessionId, decision }),
      });
      if (res.status === 401) {
        setError("Incorrect password");
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        setError("Failed to save upgrade decision");
        return;
      }
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === sessionId
            ? { ...s, upgradeDecision: decision ?? undefined }
            : s,
        ),
      );
    } catch {
      setError("Network error while saving upgrade decision");
    } finally {
      setSavingUpgradeId(null);
    }
  };

  const deleteSession = async (sessionId: string) => {
    setDeletingId(sessionId);
    setError("");
    try {
      const res = await fetch("/api/sessions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, sessionId }),
      });
      if (res.status === 401) {
        setError("Incorrect password");
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        setError("Failed to delete session");
        return;
      }
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    } catch {
      setError("Network error while deleting session");
    } finally {
      setDeletingId(null);
    }
  };

  const clearAllSessions = async () => {
    const confirmed = window.confirm(
      "Clear all session records?\n\nThis permanently deletes every patient visit log and cannot be undone. Download CSV first if you need a backup.",
    );
    if (!confirmed) return;

    setClearing(true);
    setError("");
    try {
      const res = await fetch("/api/sessions/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) {
        setError("Incorrect password");
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        setError("Failed to clear sessions");
        return;
      }
      const data = await res.json();
      setSessions([]);
      setStorage(data.storage ?? storage);
      window.alert(`Cleared ${data.deleted ?? 0} session${data.deleted === 1 ? "" : "s"}.`);
    } catch {
      setError("Network error while clearing sessions");
    } finally {
      setClearing(false);
    }
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
        <div className="flex flex-wrap gap-2">
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
          <button
            type="button"
            onClick={clearAllSessions}
            disabled={clearing || sessions.length === 0}
            className="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {clearing ? "Clearing…" : "Clear all sessions"}
          </button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <p className="mt-3 text-xs text-slate-500">
        Open the CSV in Excel or Google Sheets. Columns include name, NRIC, form date/time,{" "}
        <span className="font-medium text-slate-700">insurer</span>, consultant,{" "}
        <span className="font-medium text-slate-700">room assistant</span>,{" "}
        <span className="font-medium text-slate-700">upgrade decision</span>, seconds on each page, and{" "}
        <span className="font-medium text-slate-700">More details clicks</span> (how often the patient
        opened each outcomes detail page from the overview). VA / Refract / Compl / PROMS columns show{" "}
        <span className="font-mono">clicks × / seconds</span>. Clear all sessions requires the same
        admin password and asks for confirmation.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Patient</th>
              <th className="px-3 py-2">NRIC</th>
              <th className="px-3 py-2">Form date/time</th>
              <th className="px-3 py-2">Insurer</th>
              <th className="px-3 py-2">Room assistant</th>
              <th className="px-3 py-2">Total (s)</th>
              <th className="px-3 py-2">Details</th>
              <th className="px-3 py-2">Assess</th>
              <th className="px-3 py-2">Overview</th>
              <th className="px-3 py-2" title="More details clicks × / time on detail page">
                VA
              </th>
              <th className="px-3 py-2" title="More details clicks × / time on detail page">
                Refract
              </th>
              <th className="px-3 py-2" title="More details clicks × / time on detail page">
                Compl
              </th>
              <th className="px-3 py-2" title="More details clicks × / time on detail page">
                PROMS
              </th>
              <th className="px-3 py-2">Done</th>
              <th className="px-3 py-2">Upgrade</th>
              <th className="px-3 py-2"> </th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 && (
              <tr>
                <td colSpan={16} className="px-3 py-8 text-center text-slate-400">
                  No sessions recorded yet.
                </td>
              </tr>
            )}
            {sessions.map((s) => {
              const clicks = s.detailDrillClicks;
              const drillCell = (key: "va" | "refraction" | "complications" | "proms") => {
                const n = clicks?.[key] ?? 0;
                const secs = s.pageSeconds[key] ?? 0;
                return (
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    <span className="font-semibold text-slate-800">{n}×</span>
                    <span className="text-slate-400"> / </span>
                    <span className="text-slate-600">{secs}s</span>
                  </td>
                );
              };
              return (
              <tr key={s.sessionId} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium text-slate-800">{s.patientName || "—"}</td>
                <td className="px-3 py-2 font-mono text-xs">{s.nric || "—"}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{s.formDateTime || "—"}</td>
                <td className="px-3 py-2 text-xs text-slate-700">{s.insurer || "—"}</td>
                <td className="px-3 py-2 text-xs text-slate-700">{s.roomAssistant || "—"}</td>
                <td className="px-3 py-2 font-semibold">{s.totalSeconds}</td>
                <td className="px-3 py-2">{s.pageSeconds.details}</td>
                <td className="px-3 py-2">{s.pageSeconds.assessment}</td>
                <td className="px-3 py-2">{s.pageSeconds["outcomes-summary"] ?? 0}</td>
                {drillCell("va")}
                {drillCell("refraction")}
                {drillCell("complications")}
                {drillCell("proms")}
                <td className="px-3 py-2">{s.completed ? "Yes" : "Partial"}</td>
                <td className="px-3 py-2">
                  <select
                    value={s.upgradeDecision ?? ""}
                    disabled={savingUpgradeId === s.sessionId}
                    onChange={(e) => {
                      const v = e.target.value;
                      void setUpgradeDecision(s.sessionId, isUpgradeDecision(v) ? v : null);
                    }}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-navy/20 disabled:opacity-50 ${
                      s.upgradeDecision === "upgraded"
                        ? "border-green-300 bg-green-50 text-green-700"
                        : s.upgradeDecision === "no-upgrade"
                          ? "border-slate-300 bg-slate-100 text-slate-600"
                          : "border-amber-300 bg-amber-50 text-amber-700"
                    }`}
                  >
                    <option value="">Pending</option>
                    <option value="upgraded">Upgraded</option>
                    <option value="no-upgrade">No upgrade</option>
                    </select>
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => void deleteSession(s.sessionId)}
                    disabled={deletingId === s.sessionId}
                    className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === s.sessionId ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
              );
            })}
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
        <p className="mt-3 font-semibold text-slate-700">More details clicks (CSV)</p>
        <p className="mt-1">
          <span className="font-mono">clicks_va_details</span>,{" "}
          <span className="font-mono">clicks_refraction_details</span>,{" "}
          <span className="font-mono">clicks_complications_details</span>,{" "}
          <span className="font-mono">clicks_proms_details</span> — counted each time the patient
          opens that outcomes page from the overview. Matching{" "}
          <span className="font-mono">seconds_*</span> columns record time spent on those pages.
        </p>
      </div>
    </main>
  );
}
