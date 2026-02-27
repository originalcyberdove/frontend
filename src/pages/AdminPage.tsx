import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  loginAdmin, logoutAdmin, isLoggedIn,
  getAdminStats, getAdminLogs, getAdminNumbers, getAdminFeedback, getExportURL,
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

// ── Login ────────────────────────────────────────────────────────────────────
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [user,    setUser]    = useState("");
  const [pass,    setPass]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleLogin() {
    if (!user || !pass || loading) return;
    setLoading(true); setError(null);
    try {
      await loginAdmin(user, pass);
      onLogin();
    } catch {
      setError("Invalid credentials. Check username and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="w-14 h-14 rounded-2xl bg-green/10 border border-green/30 flex items-center justify-center text-2xl mx-auto">🛡️</div>
          <h2 className="text-xl font-black text-white">Admin Dashboard</h2>
          <p className="text-dim text-sm">Fraudlock Control Center</p>
        </div>

        <div className="bg-surface2 border border-border rounded-2xl p-6 space-y-4">
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-white placeholder-dim text-sm focus:outline-none focus:border-green transition-colors"
          />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-white placeholder-dim text-sm focus:outline-none focus:border-green transition-colors"
          />
          {error && <p className="text-danger text-xs font-mono">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading || !user || !pass}
            className="w-full py-3 rounded-xl bg-green text-bg font-bold text-sm hover:bg-green/90 transition-all disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      {/* Header   <p className="text-center text-xs text-dim font-mono">
          Create admin: <code>python manage.py createsuperuser</code> 
        </p> */}
      </div>
    </div>
  );
}

// ── Dashboard ──
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab,      setTab]      = useState<Tab>("overview");
  const [stats,    setStats]    = useState<AdminStats | null>(null);
  const [logs,     setLogs]     = useState<DetectionLog[]>([]);
  const [reported, setReported] = useState<ReportedNumber[]>([]);
  const [flagged,  setFlagged]  = useState<FlaggedNumber[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const [s, l, n, f] = await Promise.all([
          getAdminStats(), getAdminLogs(), getAdminNumbers(), getAdminFeedback(),
        ]);
        setStats(s);
        setLogs(l);
        setReported(n.reported);
        setFlagged(n.flagged);
        setFeedback(f);
      } catch {
        setError("Failed to load dashboard data. Check your token or backend.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleLogout() {
    logoutAdmin();
    onLogout();
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview",  label: "Overview"  },
    { id: "logs",      label: `Detections${logs.length ? ` (${logs.length})` : ""}` },
    { id: "numbers",   label: `Numbers${flagged.length ? ` 🔴${flagged.length}` : ""}` },
    { id: "feedback",  label: `Feedback${feedback.length ? ` (${feedback.length})` : ""}` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
          <p className="text-dim text-sm font-mono">Fraudlock Control Center</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={getExportURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg border border-green/40 text-green text-sm font-mono hover:bg-green/10 transition-all"
          >
            ↓ Export CSV
          </a>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg border border-border text-mid text-sm hover:text-danger hover:border-danger transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-mono">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border pb-0 overflow-x-auto">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={clsx(
              "px-4 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
              tab === id
                ? "border-green text-green"
                : "border-transparent text-dim hover:text-mid"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-dim font-mono">Loading…</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {tab === "overview" && stats && <OverviewTab stats={stats} />}
            {tab === "logs"     && <LogsTab logs={logs} />}
            {tab === "numbers"  && <NumbersTab reported={reported} flagged={flagged} />}
            {tab === "feedback" && <FeedbackTab feedback={feedback} />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ stats }: { stats: AdminStats }) {
  const cards = [
    { label: "Total Scanned",    value: stats.total_scanned.toLocaleString(),    color: "text-white"  },
    { label: "Spam Detected",    value: stats.spam_detected.toLocaleString(),    color: "text-danger" },
    { label: "Spam Rate",        value: `${stats.spam_rate}%`,                   color: "text-gold"   },
    { label: "Reported Numbers", value: stats.reported_numbers.toLocaleString(), color: "text-mid"    },
    { label: "Flagged for Telco",value: stats.flagged_telco.toLocaleString(),    color: "text-danger" },
    { label: "Model Accuracy",   value: `${stats.model_accuracy}%`,              color: "text-green"  },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-xl bg-surface2 border border-border space-y-1">
            <p className="text-xs text-dim font-mono uppercase tracking-wider">{label}</p>
            <p className={clsx("text-2xl font-black", color)}>{value}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-surface2 border border-border space-y-2">
        <p className="text-xs text-dim font-mono uppercase tracking-wider">Model</p>
        <div className="flex items-center gap-3">
          <span className="text-white font-mono font-bold">{stats.model_version}</span>
          <span className="text-green font-mono">{stats.model_accuracy}% accuracy</span>
          <span className="text-dim font-mono text-xs">Feedback pending: {stats.feedback_pending}</span>
        </div>
      </div>
    </div>
  );
}

// ── Logs Tab ──────────────────────────────────────────────────────────────────
function LogsTab({ logs }: { logs: DetectionLog[] }) {
  if (!logs.length) return <Empty msg="No detection logs yet." />;
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface2 text-dim font-mono text-xs uppercase">
          <tr>
            {["ID","Label","Confidence","Risk","Language","Mode","Time"].map(h => (
              <th key={h} className="px-4 py-3 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-border hover:bg-surface2/50 transition-colors">
              <td className="px-4 py-3 font-mono text-dim text-xs">#{log.id}</td>
              <td className="px-4 py-3"><LabelBadge label={log.label} /></td>
              <td className="px-4 py-3 font-mono text-white">{log.confidence}%</td>
              <td className="px-4 py-3"><RiskBadge risk={log.risk_level} /></td>
              <td className="px-4 py-3 font-mono text-mid text-xs uppercase">{log.language}</td>
              <td className="px-4 py-3 font-mono text-dim text-xs">{log.mode}</td>
              <td className="px-4 py-3 font-mono text-dim text-xs">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Numbers Tab ───────────────────────────────────────────────────────────────
function NumbersTab({ reported, flagged }: { reported: ReportedNumber[]; flagged: FlaggedNumber[] }) {
  return (
    <div className="space-y-6">
      {/* Flagged */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-danger font-mono uppercase tracking-wider">
          🔴 Flagged for Telcos ({flagged.length})
        </h3>
        {flagged.length ? (
          <div className="overflow-x-auto rounded-xl border border-danger/30">
            <table className="w-full text-sm">
              <thead className="bg-surface2 text-dim font-mono text-xs uppercase">
                <tr>
                  {["Number","Reports","Flagged By","Date","Exported"].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flagged.map((n) => (
                  <tr key={n.number} className="border-t border-border hover:bg-surface2/50">
                    <td className="px-4 py-3 font-mono text-white">{n.number}</td>
                    <td className="px-4 py-3 font-mono text-danger font-bold">{n.report_count}</td>
                    <td className="px-4 py-3 font-mono text-mid text-xs">{n.flagged_by}</td>
                    <td className="px-4 py-3 font-mono text-dim text-xs">{new Date(n.flagged_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={clsx("text-xs font-mono", n.telco_exported ? "text-green" : "text-dim")}>
                        {n.telco_exported ? "✓ Yes" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty msg="No flagged numbers yet." />}
      </div>

      {/* Reported */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-mid font-mono uppercase tracking-wider">
          Reported Numbers ({reported.length})
        </h3>
        {reported.length ? (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface2 text-dim font-mono text-xs uppercase">
                <tr>
                  {["Number","Reports","Language","First Reported","Last Reported"].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reported.map((n) => (
                  <tr key={n.number} className="border-t border-border hover:bg-surface2/50">
                    <td className="px-4 py-3 font-mono text-white">{n.number}</td>
                    <td className="px-4 py-3 font-mono text-gold font-bold">{n.report_count}</td>
                    <td className="px-4 py-3 font-mono text-mid text-xs uppercase">{n.language}</td>
                    <td className="px-4 py-3 font-mono text-dim text-xs">{new Date(n.first_reported).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-mono text-dim text-xs">{new Date(n.last_reported).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty msg="No reported numbers yet." />}
      </div>
    </div>
  );
}

// ── Feedback Tab ──────────────────────────────────────────────
function FeedbackTab({ feedback }: { feedback: FeedbackItem[] }) {
  if (!feedback.length) return <Empty msg="No unprocessed feedback yet." />;
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface2 text-dim font-mono text-xs uppercase">
          <tr>
            {["ID","Original","Corrected To","Language","Date"].map(h => (
              <th key={h} className="px-4 py-3 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {feedback.map((f) => (
            <tr key={f.id} className="border-t border-border hover:bg-surface2/50">
              <td className="px-4 py-3 font-mono text-dim text-xs">#{f.id}</td>
              <td className="px-4 py-3"><LabelBadge label={f.original_label} /></td>
              <td className="px-4 py-3"><LabelBadge label={f.corrected_label} /></td>
              <td className="px-4 py-3 font-mono text-mid text-xs uppercase">{f.language}</td>
              <td className="px-4 py-3 font-mono text-dim text-xs">{new Date(f.timestamp).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 border-t border-border text-xs text-dim font-mono">
        {feedback.length} corrections pending retraining. <code></code>
      </div>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <p className="text-center py-12 text-dim font-mono text-sm">{msg}</p>;
}
