import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { reportNumber } from "@/lib/api";
import LanguageSelector from "@/components/LanguageSelector";
import type { Language, ReportResponse } from "@/types";

export default function ReportPage() {
  const location = useLocation();

  const [number,   setNumber]   = useState("");
  const [message,  setMessage]  = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<ReportResponse | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  async function handleSubmit() {
    if (!number.trim() || loading) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await reportNumber(number.trim(), message, language);
      setResult(res);
      setNumber(""); setMessage("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">
          Report <span className="text-green">Scam Number</span>
        </h1>
        <p className="text-mid text-sm">
          Report numbers that sent you fraud or phishing messages.
          Numbers with 20+ reports are auto-flagged and sent to telcos for blocking.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { n: "1", t: "You report a scam number" },
          { n: "2", t: "Community confirms it" },
          { n: "3", t: "Telcos block the number" },
        ].map(({ n, t }) => (
          <div key={n} className="p-3 rounded-xl bg-surface2 border border-border text-center space-y-1">
            <div className="w-7 h-7 rounded-full bg-green/10 text-green text-sm font-black flex items-center justify-center mx-auto">{n}</div>
            <p className="text-xs text-mid">{t}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-dim font-mono uppercase tracking-wider">Phone Number *</label>
          <input
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="08012345678 or +2348012345678"
            className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-white placeholder-dim font-mono text-sm focus:outline-none focus:border-green transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-dim font-mono uppercase tracking-wider">Sample Message (optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste the fraud message you received…"
            rows={4}
            maxLength={500}
            className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-white placeholder-dim font-mono text-sm resize-none focus:outline-none focus:border-green transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-dim font-mono uppercase tracking-wider">Language</label>
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!number.trim() || loading}
          className="w-full py-3 rounded-xl bg-green text-bg font-bold text-sm tracking-wide hover:bg-green/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting…" : "Submit Report"}
        </button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-mono">
            ⚠ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 rounded-2xl bg-green/5 border border-green/30 space-y-3"
          >
            <p className="text-green font-bold">✓ Report submitted!</p>
            <p className="text-mid text-sm">{result.message}</p>
            <div className="flex items-center gap-4 text-sm font-mono">
              <span className="text-dim">Total reports:</span>
              <span className="text-white font-bold">{result.report_count}</span>
              {result.auto_flagged && (
                <span className="px-2 py-0.5 rounded-full bg-danger/15 text-danger border border-danger/30 text-xs">
                  🔴 Auto-flagged for telcos!
                </span>
              )}
            </div>
            <div className="h-2 rounded-full bg-surface2 overflow-hidden">
              <div
                className="h-full bg-green rounded-full transition-all"
                style={{ width: `${Math.min(100, (result.report_count / result.threshold) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-dim font-mono">
              {result.report_count} / {result.threshold} reports needed to auto-flag
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
