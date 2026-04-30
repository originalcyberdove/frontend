import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  loginAdmin, logoutAdmin, isLoggedIn,
  getAdminStats, getAdminLogs, getAdminNumbers, getAdminFeedback, getExportURL,
  flagNumber, unflagNumber,
} from "@/lib/api";
import type { AdminStats, DetectionLog, ReportedNumber, FlaggedNumber, FeedbackItem } from "@/types";
import { RiskBadge, LabelBadge } from "@/components/RiskBadge";
import clsx from "clsx";

type Tab = "overview" | "logs" | "numbers" | "feedback";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  if (!loggedIn) return <LoginForm onLogin={() => setLoggedIn(true)} />;
  return <Dashboard onLogout={() => setLoggedIn(false)} />;
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!user || !pass || loading) return;
    setLoading(true); setError(null);
    try { await loginAdmin(user, pass); onLogin(); }
    catch { setError("Invalid credentials."); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-green/30 bg-green/5 text-3xl">🛡️</div>
          <div>
            <h2 className="text-2xl font-black text-text tracking-tight">Fraud<span className="text-green">lock</span></h2>
            <p className="text-dim text-xs font-mono mt-1 uppercase tracking-widest">Admin Control Center</p>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-dim uppercase tracking-wider">Username</label>
            <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin"
              autoComplete="username"
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-dim text-sm focus:outline-none focus:border-green transition-colors font-mono" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-dim uppercase tracking-wider">Password</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••"
              autoComplete="current-password" onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder-dim text-sm focus:outline-none focus:border-green transition-colors font-mono" />
          </div>
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="text-danger text-xs font-mono bg-danger/5 border border-danger/20 rounded-lg px-3 py-2">
                ⚠ {error}
              </motion.p>
            )}
          </AnimatePresence>
          <button onClick={handleLogin} disabled={loading || !user || !pass}
            className="w-full py-3 rounded-xl bg-green text-bg font-bold text-sm tracking-wide hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Signing in…
              </span>
            ) : "Sign In →"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<DetectionLog[]>([]);
  const [reported, setReported] = useState<ReportedNumber[]>([]);
  const [flagged, setFlagged] = useState<FlaggedNumber[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [s, l, n, f] = await Promise.all([
        getAdminStats(), getAdminLogs(), getAdminNumbers(), getAdminFeedback(),
      ]);
      setStats(s); setLogs(l);
      setReported(n.reported); setFlagged(n.flagged);
      setFeedback(f);
    } catch {
      setError("Failed to load dashboard. Check your token or backend.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const TABS: { id: Tab; label: string; count?: number; danger?: boolean }[] = [
    { id: "overview", label: "Overview" },
    { id: "logs",     label: "Detections", count: logs.length },
    { id: "numbers",  label: "Numbers",    count: flagged.length, danger: flagged.length > 0 },
    { id: "feedback", label: "Feedback",   count: feedback.length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green/10 border border-green/30 flex items-center justify-center text-lg">🛡️</div>
          <div>
            <h1 className="text-xl font-black text-text">Admin Dashboard</h1>
            <p className="text-dim text-xs font-mono">Fraudlock Control Center</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData}
            className="px-4 py-2 rounded-xl border border-border text-dim text-sm hover:text-green hover:border-green/40 transition-all flex items-center gap-1.5 font-mono">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <a href={getExportURL()} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl border border-green/40 text-green text-sm font-mono hover:bg-green/10 transition-all flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </a>
          <button onClick={() => { logoutAdmin(); onLogout(); }}
            className="px-4 py-2 rounded-xl border border-border text-dim text-sm hover:text-danger hover:border-danger/40 transition-all">
            Sign Out
          </button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-danger/5 border border-danger/30 text-danger text-sm font-mono">
            ⚠ {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-1 p-1 bg-surface rounded-xl border border-border w-fit overflow-x-auto">
        {TABS.map(({ id, label, count, danger }) => (
          <button key={id} onClick={() => setTab(id)}
            className={clsx(
              "px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5",
              tab === id ? "bg-green/15 text-green border border-green/30" : "text-dim hover:text-mid"
            )}>
            {label}
            {count !== undefined && count > 0 && (
              <span className={clsx("px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                danger ? "bg-danger/20 text-danger" : "bg-surface2 text-mid")}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-dim font-mono text-sm">
          <svg className="w-5 h-5 animate-spin text-green" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading dashboard…
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {tab === "overview" && stats && <OverviewTab stats={stats} />}
            {tab === "logs"     && <LogsTab logs={logs} />}
            {tab === "numbers"  && <NumbersTab reported={reported} flagged={flagged} onRefresh={loadData} />}
            {tab === "feedback" && <FeedbackTab feedback={feedback} />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function OverviewTab({ stats }: { stats: AdminStats }) {
  const accuracy     = stats.model_accuracy != null ? `${stats.model_accuracy}%` : "—";
  const modelVersion = stats.model_version  || "SVM (LinearSVC)";
  const spamRate     = stats.spam_rate      != null ? `${stats.spam_rate}%`      : "—";
  const pending      = stats.feedback_pending ?? 0;

  const cards = [
    { label: "Total Scanned",     value: (stats.total_scanned    ?? 0).toLocaleString(), color: "text-text",   icon: "📊", border: "border-border"    },
    { label: "Spam Detected",     value: (stats.spam_detected    ?? 0).toLocaleString(), color: "text-danger", icon: "🚨", border: "border-danger/20" },
    { label: "Spam Rate",         value: spamRate,                                         color: "text-gold",   icon: "📈", border: "border-gold/20"   },
    { label: "Reported Numbers",  value: (stats.reported_numbers ?? 0).toLocaleString(), color: "text-mid",    icon: "📞", border: "border-border"    },
    { label: "Flagged for Telco", value: (stats.flagged_telco    ?? 0).toLocaleString(), color: "text-danger", icon: "🔴", border: "border-danger/20" },
    { label: "Model Accuracy",    value: accuracy,                                         color: "text-green",  icon: "🎯", border: "border-green/20"  },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map(({ label, value, color, icon, border }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={clsx("p-5 rounded-xl border bg-surface space-y-3 hover:brightness-110 transition-all", border)}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-dim font-mono uppercase tracking-wider">{label}</p>
              <span className="text-sm opacity-60">{icon}</span>
            </div>
            <p className={clsx("text-3xl font-black tracking-tight font-mono", color)}>{value}</p>
          </motion.div>
        ))}
      </div>
      <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3 flex-wrap">
        <span className="w-2 h-2 rounded-full bg-green animate-pulse flex-shrink-0" />
        <span className="text-xs font-mono text-dim uppercase tracking-wider">Active Model</span>
        <span className="text-text font-mono font-bold text-sm">{modelVersion}</span>
        {stats.model_accuracy != null && (
          <span className="px-2 py-0.5 rounded-full bg-green/10 border border-green/20 text-green font-mono text-xs font-bold">
            {stats.model_accuracy}% accuracy
          </span>
        )}
        {pending > 0 && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-mono text-gold">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            {pending} corrections pending retraining
          </span>
        )}
      </div>
    </div>
  );
}

function LogsTab({ logs }: { logs: DetectionLog[] }) {
  const [search, setSearch] = useState("");
  const [filterLabel, setFilterLabel] = useState<"all" | "spam" | "legitimate">("all");

  const filtered = logs.filter(l => {
    const matchLabel = filterLabel === "all" || l.label === filterLabel;
    const matchSearch = !search || l.detection_id?.toLowerCase().includes(search.toLowerCase());
    return matchLabel && matchSearch;
  });

  if (!logs.length) return <Empty msg="No detection logs yet." />;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input type="text" placeholder="Search detection ID…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-text placeholder-dim focus:outline-none focus:border-green transition-colors w-48" />
        {(["all", "spam", "legitimate"] as const).map(f => (
          <button key={f} onClick={() => setFilterLabel(f)}
            className={clsx("px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all border",
              filterLabel === f ? "bg-green/15 text-green border-green/30" : "border-border text-dim hover:text-mid")}>
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-dim font-mono">{filtered.length} records</span>
      </div>
      <div className="rounded-xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-surface border-b border-border">
              {["ID", "Label", "Confidence", "Risk", "Language", "Mode", "Time"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-mono text-dim uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, i) => (
              <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}
                className="border-t border-border hover:bg-surface transition-colors">
                <td className="px-4 py-3 font-mono text-dim text-xs">#{log.id}</td>
                <td className="px-4 py-3"><LabelBadge label={log.label} /></td>
                <td className="px-4 py-3 font-mono text-text font-bold">{log.confidence}%</td>
                <td className="px-4 py-3"><RiskBadge risk={log.risk_level} /></td>
                <td className="px-4 py-3 font-mono text-mid text-xs uppercase">{log.language}</td>
                <td className="px-4 py-3 font-mono text-dim text-xs">{log.mode}</td>
                <td className="px-4 py-3 font-mono text-dim text-xs">{new Date(log.timestamp).toLocaleString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NumbersTab({ reported, flagged, onRefresh }: {
  reported: ReportedNumber[];
  flagged: FlaggedNumber[];
  onRefresh: () => void;
}) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [manualNumber, setManualNumber] = useState("");
  const [manualReason, setManualReason] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [search, setSearch] = useState("");

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleFlag(number: string) {
    setActionLoading(number);
    try {
      await flagNumber(number);
      showToast(`${number} flagged for telco review.`, "success");
      onRefresh();
    } catch { showToast("Failed to flag number.", "error"); }
    finally { setActionLoading(null); }
  }

  async function handleUnflag(number: string) {
    setActionLoading(number);
    try {
      await unflagNumber(number);
      showToast(`${number} unflagged.`, "success");
      onRefresh();
    } catch { showToast("Failed to unflag number.", "error"); }
    finally { setActionLoading(null); }
  }

  async function handleManualFlag() {
    if (!manualNumber.trim()) return;
    setActionLoading("manual");
    try {
      await flagNumber(manualNumber.trim(), manualReason.trim());
      showToast(`${manualNumber} flagged successfully.`, "success");
      setManualNumber(""); setManualReason(""); setShowManual(false);
      onRefresh();
    } catch { showToast("Failed to flag number.", "error"); }
    finally { setActionLoading(null); }
  }

  const isFlagged = (number: string) => flagged.some(f => f.number === number);
  const filteredReported = reported.filter(r => !search || r.number.includes(search));

  function Spinner() {
    return (
      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={clsx("fixed top-4 right-4 z-50 px-4 py-3 rounded-xl font-mono text-sm shadow-lg border",
              toast.type === "success" ? "bg-green/10 border-green/30 text-green" : "bg-danger/10 border-danger/30 text-danger")}>
            {toast.type === "success" ? "✓" : "⚠"} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual flag */}
      <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-sm font-bold text-text font-mono">Manual Flag</span>
            <span className="text-xs text-dim font-mono ml-2">— flag a number without community reports</span>
          </div>
          <button onClick={() => setShowManual(v => !v)}
            className={clsx("px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all",
              showManual ? "bg-danger/10 text-danger border-danger/30" : "bg-green/10 text-green border-green/30 hover:bg-green/20")}>
            {showManual ? "✕ Cancel" : "+ Flag Number"}
          </button>
        </div>
        <AnimatePresence>
          {showManual && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="pt-2 flex flex-wrap gap-3">
                <input type="text" placeholder="e.g. 08012345678" value={manualNumber}
                  onChange={e => setManualNumber(e.target.value)}
                  className="bg-bg border border-border rounded-lg px-3 py-2 text-sm font-mono text-text placeholder-dim focus:outline-none focus:border-green transition-colors flex-1 min-w-[160px]" />
                <input type="text" placeholder="Reason (optional)" value={manualReason}
                  onChange={e => setManualReason(e.target.value)}
                  className="bg-bg border border-border rounded-lg px-3 py-2 text-sm font-mono text-text placeholder-dim focus:outline-none focus:border-green transition-colors flex-1 min-w-[200px]" />
                <button onClick={handleManualFlag} disabled={!manualNumber.trim() || actionLoading === "manual"}
                  className="px-4 py-2 rounded-lg bg-danger text-white text-sm font-bold font-mono hover:opacity-90 transition-all disabled:opacity-40 flex items-center gap-2">
                  {actionLoading === "manual" ? <Spinner /> : "🚩"} Flag
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Flagged for Telcos */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
          <h3 className="text-sm font-bold text-danger font-mono uppercase tracking-wider">
            Flagged for Telcos ({flagged.length})
          </h3>
        </div>
        {flagged.length ? (
          <div className="rounded-xl border border-danger/25 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-surface border-b border-danger/20">
                  {["Number", "Reports", "Flagged By", "Date", "Status", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-mono text-dim uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flagged.map((n, i) => (
                  <motion.tr key={n.number} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-t border-border hover:bg-surface transition-colors">
                    <td className="px-4 py-3 font-mono text-text font-bold">{n.number}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-danger/10 border border-danger/20 text-danger font-mono font-black text-sm">
                        {n.report_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-mid text-xs">{n.flagged_by}</td>
                    <td className="px-4 py-3 font-mono text-dim text-xs">{new Date(n.flagged_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border",
                        n.telco_exported ? "bg-green/10 text-green border-green/25" : "bg-surface2 text-dim border-border")}>
                        {n.telco_exported ? "✓ Exported" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleUnflag(n.number)} disabled={actionLoading === n.number}
                        className="px-3 py-1 rounded-lg bg-surface2 border border-border text-dim text-xs font-mono font-bold hover:text-danger hover:border-danger/40 transition-all disabled:opacity-40 flex items-center gap-1">
                        {actionLoading === n.number ? <Spinner /> : "✕"} Unflag
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty msg="No numbers flagged for telcos yet." />}
      </div>

      {/* All Reported */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-mid font-mono uppercase tracking-wider">
            All Reported ({reported.length})
          </h3>
          <input type="text" placeholder="Search number…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-text placeholder-dim focus:outline-none focus:border-green transition-colors w-40" />
        </div>
        {filteredReported.length ? (
          <div className="rounded-xl border border-border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-surface border-b border-border">
                  {["Number", "Reports", "Language", "First Seen", "Last Seen", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-mono text-dim uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReported.map((n, i) => (
                  <motion.tr key={n.number} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="border-t border-border hover:bg-surface transition-colors">
                    <td className="px-4 py-3 font-mono text-text">{n.number}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold font-mono font-bold text-xs">
                        {n.report_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-mid text-xs uppercase">{n.language}</td>
                    <td className="px-4 py-3 font-mono text-dim text-xs">{new Date(n.first_reported).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-mono text-dim text-xs">{new Date(n.last_reported).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {isFlagged(n.number) ? (
                        <button onClick={() => handleUnflag(n.number)} disabled={actionLoading === n.number}
                          className="px-3 py-1 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs font-mono font-bold hover:bg-danger/20 transition-all disabled:opacity-40 flex items-center gap-1">
                          {actionLoading === n.number ? <Spinner /> : "✕"} Unflag
                        </button>
                      ) : (
                        <button onClick={() => handleFlag(n.number)} disabled={actionLoading === n.number}
                          className="px-3 py-1 rounded-lg bg-surface2 border border-border text-dim text-xs font-mono font-bold hover:text-danger hover:border-danger/40 transition-all disabled:opacity-40 flex items-center gap-1">
                          {actionLoading === n.number ? <Spinner /> : "🚩"} Flag
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty msg="No reported numbers yet." />}
      </div>
    </div>
  );
}

function FeedbackTab({ feedback }: { feedback: FeedbackItem[] }) {
  if (!feedback.length) return <Empty msg="No unprocessed feedback yet." />;
  return (
    <div className="space-y-3">
      <p className="text-xs text-dim font-mono">{feedback.length} corrections pending retraining</p>
      <div className="rounded-xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="bg-surface border-b border-border">
              {["ID", "Original", "Corrected To", "Language", "Date"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-mono text-dim uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {feedback.map((f, i) => (
              <motion.tr key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="border-t border-border hover:bg-surface transition-colors">
                <td className="px-4 py-3 font-mono text-dim text-xs">#{f.id}</td>
                <td className="px-4 py-3"><LabelBadge label={f.original_label} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-dim text-xs">→</span>
                    <LabelBadge label={f.corrected_label} />
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-mid text-xs uppercase">{f.language}</td>
                <td className="px-4 py-3 font-mono text-dim text-xs">{new Date(f.timestamp).toLocaleDateString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3">
      <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-xl">📭</div>
      <p className="text-dim font-mono text-sm">{msg}</p>
    </div>
  );
}