import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { lookupNumber, getDirectory } from "@/lib/api";
import type { NumberLookupResult, DirectoryEntry } from "@/types";

type Tab = "lookup" | "directory";

const CARRIER_COLORS: Record<string, string> = {
  "MTN":      "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  "Airtel":   "bg-red-500/10 text-red-400 border-red-500/30",
  "Glo":      "bg-green/10 text-green border-green/30",
  "Etisalat": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "9mobile":  "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

const CARRIER_ICONS: Record<string, string> = {
  "MTN":      "🟡",
  "Airtel":   "🔴",
  "Glo":      "🟢",
  "Etisalat": "🔵",
  "9mobile":  "🔵",
};

export default function NumbersPage() {
  const { t } = useTranslation();
  const [tab,        setTab]        = useState<Tab>("lookup");
  const [query,      setQuery]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState<NumberLookupResult | null>(null);
  const [error,      setError]      = useState<string | null>(null);
  const [directory,  setDirectory]  = useState<DirectoryEntry[]>([]);
  const [dirLoading, setDirLoading] = useState(false);

  useEffect(() => {
    if (tab === "directory" && directory.length === 0) fetchDirectory();
  }, [tab]);

  async function fetchDirectory() {
    setDirLoading(true);
    try {
      const data = await getDirectory();
      setDirectory(data);
    } catch { setDirectory([]); }
    finally { setDirLoading(false); }
  }

  async function handleLookup() {
    const number = query.trim();
    if (!number || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await lookupNumber(number);
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLookup();
  }

  const THRESHOLD = 20;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">
          {t("numbers_title")} <span className="text-green">{t("numbers_title_2")}</span>
        </h1>
        <p className="text-mid text-sm">{t("numbers_subtitle")}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface2 rounded-xl border border-border w-fit">
        {(["lookup", "directory"] as Tab[]).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
              tab === tb
                ? "bg-green/15 text-green border border-green/30"
                : "text-dim hover:text-mid"
            }`}
          >
            {t(`numbers_tab_${tb}`)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── LOOKUP TAB ── */}
        {tab === "lookup" && (
          <motion.div
            key="lookup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs text-dim font-mono uppercase tracking-wider">
                {t("numbers_search_label")}
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setResult(null); }}
                  onKeyDown={handleKey}
                  placeholder={t("numbers_search_placeholder")}
                  className="flex-1 bg-surface2 border border-border rounded-xl px-4 py-3 text-white placeholder-dim font-mono text-sm focus:outline-none focus:border-green transition-colors"
                />
                <button
                  onClick={handleLookup}
                  disabled={!query.trim() || loading}
                  className="px-5 py-3 rounded-xl bg-green text-bg font-bold text-sm tracking-wide hover:bg-green/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? t("numbers_searching") : t("numbers_search_btn")}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-danger font-mono">⚠ {error}</p>}

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Number header */}
                  <div className={`p-5 rounded-2xl border space-y-4 ${
                    result.auto_flagged
                      ? "bg-danger/5 border-danger/30"
                      : result.found
                      ? "bg-gold/5 border-gold/20"
                      : "bg-green/5 border-green/20"
                  }`}>

                    {/* Number + status badge */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <span className="text-white font-mono font-bold text-lg">
                        {result.number}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Carrier badge */}
                        {result.network && (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-mono border ${
                            CARRIER_COLORS[result.network] ?? "bg-surface2 text-mid border-border"
                          }`}>
                            {CARRIER_ICONS[result.network] ?? "📶"} {result.network}
                          </span>
                        )}
                        {/* Fraud status badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                          result.auto_flagged
                            ? "bg-danger/15 text-danger border-danger/30"
                            : result.found
                            ? "bg-gold/10 text-gold border-gold/20"
                            : "bg-green/10 text-green border-green/30"
                        }`}>
                          {result.auto_flagged
                            ? `🔴 ${t("numbers_flagged_badge")}`
                            : result.found
                            ? `🟡 ${t("numbers_under_review")}`
                            : `✓ ${t("numbers_safe_badge")}`}
                        </span>
                      </div>
                    </div>

                    {/* Clean number — carrier info only */}
                    {!result.found && (
                      <p className="text-mid text-sm font-mono">{t("numbers_clean")}</p>
                    )}

                    {/* Stats grid — only if reported */}
                    {result.found && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-surface2 border border-border">
                          <p className="text-xs text-dim font-mono uppercase tracking-wider mb-1">
                            {t("numbers_report_count")}
                          </p>
                          <p className="text-2xl font-black text-white">{result.report_count}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-surface2 border border-border">
                          <p className="text-xs text-dim font-mono uppercase tracking-wider mb-1">
                            {t("numbers_status")}
                          </p>
                          <p className="text-sm font-bold text-white capitalize">
                            {result.predicted_label || "—"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* DND warning */}
                    {result.dnd && (
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface2 border border-border text-xs font-mono text-mid">
                        <span>🔕</span>
                        <span>DND active — this number has blocked promotional messages</span>
                      </div>
                    )}

                    {/* Progress bar — only if under review */}
                    {result.found && !result.auto_flagged && (
                      <div className="space-y-1.5">
                        <div className="h-2 rounded-full bg-surface2 overflow-hidden">
                          <div
                            className="h-full bg-gold rounded-full transition-all"
                            style={{ width: `${Math.min(100, (result.report_count / THRESHOLD) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-dim font-mono">
                          {result.report_count} / {THRESHOLD} {t("numbers_progress_label")}
                        </p>
                      </div>
                    )}

                    {/* Dates */}
                    {result.found && (
                      <div className="flex gap-4 text-xs font-mono text-dim flex-wrap">
                        {result.first_reported && (
                          <span>
                            {t("numbers_first_seen")}:{" "}
                            <span className="text-mid">
                              {new Date(result.first_reported).toLocaleDateString()}
                            </span>
                          </span>
                        )}
                        {result.last_reported && (
                          <span>
                            {t("numbers_last_seen")}:{" "}
                            <span className="text-mid">
                              {new Date(result.last_reported).toLocaleDateString()}
                            </span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Report CTA */}
                    <Link
                      to="/report"
                      state={{ number: result.number }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs font-mono font-bold hover:bg-danger/20 transition-all"
                    >
                      + {t("numbers_report_this")}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── DIRECTORY TAB ── */}
        {tab === "directory" && (
          <motion.div
            key="directory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <h2 className="text-white font-bold">{t("numbers_directory_title")}</h2>
              <p className="text-mid text-xs font-mono">{t("numbers_directory_subtitle")}</p>
            </div>

            {dirLoading ? (
              <div className="flex items-center gap-2 text-dim text-xs font-mono py-8 justify-center">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Loading...
              </div>
            ) : directory.length === 0 ? (
              <p className="text-dim text-sm font-mono py-8 text-center">
                {t("numbers_empty_directory")}
              </p>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-surface2 border-b border-border text-[10px] font-mono text-dim uppercase tracking-widest">
                  <span className="col-span-4">{t("numbers_col_number")}</span>
                  <span className="col-span-2 text-center">{t("numbers_col_reports")}</span>
                  <span className="col-span-3 text-center">{t("numbers_col_status")}</span>
                  <span className="col-span-3 text-right">{t("numbers_col_flagged")}</span>
                </div>

                <div className="divide-y divide-border">
                  {directory.map((entry, i) => (
                    <motion.div
                      key={entry.number}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-surface2/50 transition-colors"
                    >
                      <button
                        className="col-span-4 text-left font-mono text-sm text-white hover:text-green transition-colors truncate"
                        onClick={() => { setTab("lookup"); setQuery(entry.number); }}
                      >
                        {entry.number}
                      </button>
                      <span className="col-span-2 text-center font-mono font-bold text-danger text-sm">
                        {entry.report_count}
                      </span>
                      <span className="col-span-3 flex justify-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                          entry.auto_flagged
                            ? "bg-danger/15 text-danger border-danger/30"
                            : "bg-gold/10 text-gold border-gold/20"
                        }`}>
                          {entry.auto_flagged
                            ? t("numbers_flagged_badge")
                            : t("numbers_under_review")}
                        </span>
                      </span>
                      <span className="col-span-3 text-right text-[10px] text-dim font-mono">
                        {entry.flagged_at
                          ? new Date(entry.flagged_at).toLocaleDateString()
                          : "—"}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}