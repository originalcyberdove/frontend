import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { reportNumber } from "@/lib/api";
import LanguageSelector from "@/components/LanguageSelector";
import type { Language, ReportResponse } from "@/types";


export default function ReportPage() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const normalise = (code: string): Language => {
    const base = code.split("-")[0] as Language;
    const valid: Language[] = ["en", "pid", "yo", "ha", "ig"];
    return valid.includes(base) ? base : "en";
  };

  const [number,   setNumber]   = useState("");
  const [message,  setMessage]  = useState("");
  const [language, setLanguage] = useState<Language>(normalise(i18n.language));
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<ReportResponse | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  // Sync language selector with i18n on load
  useEffect(() => {
    setLanguage(normalise(i18n.language));
  }, [i18n.language]);

  // Pre-fill message if coming from DetectPage
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  function handleLanguageChange(lang: Language) {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }

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

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">
          {t("report_title_1")} <span className="text-green">{t("report_title_2")}</span>
        </h1>
        <p className="text-mid text-sm">
          {t("report_subtitle")}
        </p>
      </div>
      {/* How it works */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { n: "1", label: t("report_step_1") },
          { n: "2", label: t("report_step_2") },
          { n: "3", label: t("report_step_3") },
        ].map(({ n, label }) => (
          <div key={n} className="p-3 rounded-xl bg-surface2 border border-border text-center space-y-1">
            <div className="w-7 h-7 rounded-full bg-green/10 text-green text-sm font-black flex items-center justify-center mx-auto">
              {n}
            </div>
            <p className="text-xs text-mid">{label}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="space-y-4">

        <div className="space-y-1">
          <label className="text-xs text-dim font-mono uppercase tracking-wider">
            {t("report_phone_label")}
          </label>
          <input
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder={t("report_phone_placeholder")}
            className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-white placeholder-dim font-mono text-sm focus:outline-none focus:border-green transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-dim font-mono uppercase tracking-wider">
            {t("report_message_label")}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("report_message_placeholder")}
            rows={4}
            maxLength={500}
            className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-white placeholder-dim font-mono text-sm resize-none focus:outline-none focus:border-green transition-colors"
          />
        </div>

      
        <button
          onClick={handleSubmit}
          disabled={!number.trim() || loading}
          className="w-full py-3 rounded-xl bg-green text-bg font-bold text-sm tracking-wide hover:bg-green/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? t("report_submitting") : t("report_submit_btn")}
        </button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-mono"
          >
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
            <p className="text-green font-bold">{t("report_success_title")}</p>
            <p className="text-mid text-sm">{result.message}</p>
            <div className="flex items-center gap-4 text-sm font-mono">
              <span className="text-dim">{t("report_total_label")}</span>
              <span className="text-white font-bold">{result.report_count}</span>
              {result.auto_flagged && (
                <span className="px-2 py-0.5 rounded-full bg-danger/15 text-danger border border-danger/30 text-xs">
                  {t("report_auto_flagged")}
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
              {t("report_progress", {
                count:     result.report_count,
                threshold: result.threshold,
              })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}