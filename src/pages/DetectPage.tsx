import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDetect } from "@/hooks/useDetect";
import ResultCard from "@/components/ResultCard";
import LanguageSelector from "@/components/LanguageSelector";
import type { Language } from "@/types";

const EXAMPLES = [
  "Dear customer, your GTB account has been suspended. Verify your BVN and OTP immediately at gtb-verify.net to avoid losing your funds.",
  "JAMB: Your result has been upgraded to 280. Pay N3500 to claim. Call 08012345678 now.",
  "Hi Emeka, are we still on for the meeting tomorrow at 3pm? Let me know if the time works.",
  "Congratulations! You have won N500000 in the MTN WhatsApp lottery. Send your bank details to claim.",
];

export default function DetectPage() {
  const { t, i18n } = useTranslation();

  // Keep language state in sync with i18n
  // i18n.language may be "en-US" from browser — normalise to base code
  const normalise = (code: string): Language => {
    const base = code.split("-")[0] as Language;
    const valid: Language[] = ["en", "pid", "yo", "ha", "ig"];
    return valid.includes(base) ? base : "en";
  };

  const [message,  setMessage]  = useState("");
  const [language, setLanguage] = useState<Language>(
    normalise(i18n.language)
  );
  const { result, loading, error, analyze, reset } = useDetect();

  // When user picks a language in the selector:
  //   1. Update local state (sent to backend)
  //   2. Update i18n (changes UI language)
  function handleLanguageChange(lang: Language) {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }

  // If i18n language changes from outside (e.g. localStorage on load),
  // keep local language state in sync
  useEffect(() => {
    setLanguage(normalise(i18n.language));
  }, [i18n.language]);

  function handleSubmit() {
    if (!message.trim() || loading) return;
    analyze(message, language);
  }

  function loadExample(ex: string) {
    setMessage(ex);
    reset();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">
          {t("detect_title_1")} <span className="text-green">{t("detect_title_2")}</span>
        </h1>
        <p className="text-mid text-sm">
          {t("detect_subtitle")}
        </p>
      </div>

      {/* Language selector — now controls both UI and backend */}
      <div className="space-y-2">
        <p className="text-xs text-dim font-mono uppercase tracking-wider">
          {t("detect_language_label")}
        </p>
        <LanguageSelector value={language} onChange={handleLanguageChange} />
      </div>

      {/* Input */}
      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => { setMessage(e.target.value); reset(); }}
          placeholder={t("detect_placeholder")}
          rows={5}
          maxLength={1600}
          className="w-full bg-surface2 border border-border rounded-xl p-4 text-white placeholder-dim font-mono text-sm resize-none focus:outline-none focus:border-green transition-colors"
        />
        <div className="flex items-center justify-between text-xs text-dim font-mono">
          <span>{message.length} / 1600</span>
          <button
            onClick={() => { setMessage(""); reset(); }}
            className="hover:text-mid transition-colors"
          >
            {t("detect_clear")}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!message.trim() || loading}
          className="w-full py-3 rounded-xl bg-green text-bg font-bold text-sm tracking-wide hover:bg-green/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? t("detect_analyzing") : t("detect_analyze_btn")}
        </button>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-mono"
            >
              ⚠ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <ResultCard result={result} language={language} message={message} />
          )}
        </AnimatePresence>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <p className="text-xs text-dim font-mono uppercase tracking-wider">
          {t("detect_samples_label")}
        </p>
        <div className="grid gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => loadExample(ex)}
              className="text-left p-3 rounded-lg bg-surface2 border border-border hover:border-green/40 text-mid text-xs font-mono hover:text-white transition-all truncate"
            >
              {ex.slice(0, 90)}…
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}