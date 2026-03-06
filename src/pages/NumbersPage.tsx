import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { lookupNumber, getDirectory } from "@/lib/api";
import type { NumberLookupResult, DirectoryEntry } from "@/types";
import CarrierBadge from "@/components/CarrierBadge";
type Tab = "lookup" | "directory";

// Carrier config — logos from brand CDNs that allow hotlinking
const CARRIERS: Record<string, { color: string; bg: string; logo: string; fallback: string }> = {
  "MTN": {
    color:    "#ffcc00",
    bg:       "rgba(255,204,0,0.12)",
    logo:     "https://logo.clearbit.com/mtn.com",
    fallback: "🟡",
  },
  "Airtel": {
    color:    "#ff0000",
    bg:       "rgba(255,0,0,0.10)",
    logo:     "https://logo.clearbit.com/airtel.com",
    fallback: "🔴",
  },
  "Glo": {
    color:    "#00aa00",
    bg:       "rgba(0,170,0,0.10)",
    logo:     "https://logo.clearbit.com/gloworld.com",
    fallback: "🟢",
  },
  "Etisalat": {
    color:    "#ff6600",
    bg:       "rgba(255,102,0,0.10)",
    logo:     "https://logo.clearbit.com/9mobile.com.ng",
    fallback: "🟠",
  },
  "9mobile": {
    color:    "#ff6600",
    bg:       "rgba(255,102,0,0.10)",
    logo:     "https://logo.clearbit.com/9mobile.com.ng",
    fallback: "🟠",
  },
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
    try { setDirectory(await getDirectory()); }
    catch { setDirectory([]); }
    finally { setDirLoading(false); }
  }

  async function handleLookup() {
    const number = query.trim();
    if (!number || loading) return;
    setLoading(true); setResult(null); setError(null);
    try { setResult(await lookupNumber(number)); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Lookup failed."); }
    finally { setLoading(false); }
  }

  const THRESHOLD = 20;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-text">
          {t("numbers_title")}{" "}
          <span className="text-green">{t("numbers_title_2")}</span>
        </h1>
        <p className="text-sm text-mid">{t("numbers_subtitle")}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface2 rounded-xl border border-border w-fit">
        {(["lookup", "directory"] as Tab[]).map((tb) => (
          <button key={tb} onClick={() => setTab(tb)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
              tab === tb ? "bg-green/15 text-green border border-green/30" : "text-dim hover:text-mid"
            }`}
          >
            {t(`numbers_tab_${tb}`)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── LOOKUP ── */}
        {tab === "lookup" && (
          <motion.div key="lookup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

            <div className="space-y-1">
              <label className="text-xs text-dim font-mono uppercase tracking-wider">
                {t("numbers_search_label")}
              </label>
              <div className="flex gap-2">
                <input
                  type="tel" value={query}
                  onChange={(e) => { setQuery(e.target.value); setResult(null); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  placeholder={t("numbers_search_placeholder")}
                  className="flex-1 bg-surface2 border border-border rounded-xl px-4 py-3 text-text placeholder-dim font-mono text-sm focus:outline-none focus:border-green transition-colors"
                />
                <button onClick={handleLookup} disabled={!query.trim() || loading}
                  className="px-5 py-3 rounded-xl bg-green text-bg font-bold text-sm tracking-wide hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? t("numbers_searching") : t("numbers_search_btn")}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-danger font-mono">⚠ {error}</p>}

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-5 rounded-2xl border space-y-4"
                  style={{
                    background: result.auto_flagged ? "rgba(229,57,53,0.06)"
                              : result.found        ? "rgba(249,200,76,0.06)"
                              :                       "rgba(0,200,83,0.06)",
                    borderColor: result.auto_flagged ? "rgba(229,57,53,0.30)"
                               : result.found        ? "rgba(249,200,76,0.25)"
                               :                       "rgba(0,200,83,0.25)",
                  }}
                >
                  {/* Number + badges */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <span className="font-mono font-bold text-lg text-text">{result.number}</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {result.network && <CarrierBadge network={result.network} />}
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
                        style={
                          result.auto_flagged
                            ? { background: "rgba(229,57,53,0.15)", color: "var(--danger)", borderColor: "rgba(229,57,53,0.3)" }
                            : result.found
                            ? { background: "rgba(249,200,76,0.12)", color: "var(--gold)", borderColor: "rgba(249,200,76,0.25)" }
                            : { background: "rgba(0,200,83,0.12)", color: "var(--green)", borderColor: "rgba(0,200,83,0.25)" }
                        }
                      >
                        {result.auto_flagged ? `🔴 ${t("numbers_flagged_badge")}`
                          : result.found     ? `🟡 ${t("numbers_under_review")}`
                          :                    `✓ ${t("numbers_safe_badge")}`}
                      </span>
                    </div>
                  </div>

                  {!result.found && (
                    <p className="text-sm font-mono text-mid">{t("numbers_clean")}</p>
                  )}

                  {result.found && (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: t("numbers_report_count"), value: result.report_count },
                        { label: t("numbers_status"),       value: result.predicted_label || "—" },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-3 rounded-lg bg-surface2 border border-border">
                          <p className="text-xs font-mono uppercase tracking-wider mb-1 text-dim">{label}</p>
                          <p className="text-2xl font-black text-text">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.dnd && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface2 border border-border text-xs font-mono text-mid">
                      🔕 DND active — blocked promotional messages
                    </div>
                  )}

                  {result.found && !result.auto_flagged && (
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-surface2 overflow-hidden">
                        <div className="h-full rounded-full transition-all bg-gold"
                          style={{ width: `${Math.min(100, (result.report_count / THRESHOLD) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs font-mono text-dim">
                        {result.report_count} / {THRESHOLD} {t("numbers_progress_label")}
                      </p>
                    </div>
                  )}

                  {result.found && (
                    <div className="flex gap-4 text-xs font-mono text-dim flex-wrap">
                      {result.first_reported && (
                        <span>{t("numbers_first_seen")}: <span className="text-mid">{new Date(result.first_reported).toLocaleDateString()}</span></span>
                      )}
                      {result.last_reported && (
                        <span>{t("numbers_last_seen")}: <span className="text-mid">{new Date(result.last_reported).toLocaleDateString()}</span></span>
                      )}
                    </div>
                  )}

                  <Link to="/report" state={{ number: result.number }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-mono font-bold transition-all hover:opacity-80"
                    style={{ background: "rgba(229,57,53,0.10)", borderColor: "rgba(229,57,53,0.30)", color: "var(--danger)" }}
                  >
                    + {t("numbers_report_this")}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── DIRECTORY ── */}
        {tab === "directory" && (
          <motion.div key="directory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div>
              <h2 className="font-bold text-text">{t("numbers_directory_title")}</h2>
              <p className="text-xs font-mono text-mid">{t("numbers_directory_subtitle")}</p>
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
              <p className="text-sm font-mono text-dim py-8 text-center">{t("numbers_empty_directory")}</p>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-surface2 border-b border-border text-[10px] font-mono text-dim uppercase tracking-widest">
                  <span className="col-span-4">{t("numbers_col_number")}</span>
                  <span className="col-span-2 text-center">{t("numbers_col_reports")}</span>
                  <span className="col-span-3 text-center">{t("numbers_col_status")}</span>
                  <span className="col-span-3 text-right">{t("numbers_col_flagged")}</span>
                </div>
                <div className="divide-y divide-border">
                  {directory.map((entry, i) => (
                    <motion.div key={entry.number}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-surface2/50 transition-colors"
                    >
                      <button
                        className="col-span-4 text-left font-mono text-sm text-text hover:text-green transition-colors truncate"
                        onClick={() => { setTab("lookup"); setQuery(entry.number); }}
                      >
                        {entry.number}
                      </button>
                      <span className="col-span-2 text-center font-mono font-bold text-sm text-danger">
                        {entry.report_count}
                      </span>
                      <span className="col-span-3 flex justify-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border"
                          style={entry.auto_flagged
                            ? { background: "rgba(229,57,53,0.15)", color: "var(--danger)", borderColor: "rgba(229,57,53,0.3)" }
                            : { background: "rgba(249,200,76,0.12)", color: "var(--gold)", borderColor: "rgba(249,200,76,0.25)" }
                          }
                        >
                          {entry.auto_flagged ? t("numbers_flagged_badge") : t("numbers_under_review")}
                        </span>
                      </span>
                      <span className="col-span-3 text-right text-[10px] font-mono text-dim">
                        {entry.flagged_at ? new Date(entry.flagged_at).toLocaleDateString() : "—"}
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