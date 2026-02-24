import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [message,  setMessage]  = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const { result, loading, error, analyze, reset } = useDetect();

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
          SMS <span className="text-green">Fraud Detector</span>
        </h1>
        <p className="text-mid text-sm">
          Paste any SMS to check if it's a phishing attempt.
          Powered by TF-IDF + Random Forest + SVM ensemble.
        </p>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <p className="text-xs text-dim font-mono uppercase tracking-wider">Language</p>
        <LanguageSelector value={language} onChange={setLanguage} />
      </div>

      {/* Input */}
      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => { setMessage(e.target.value); reset(); }}
          placeholder="Paste SMS message here…"
          rows={5}
          maxLength={1600}
          className="w-full bg-surface2 border border-border rounded-xl p-4 text-white placeholder-dim font-mono text-sm resize-none focus:outline-none focus:border-green transition-colors"
        />
        <div className="flex items-center justify-between text-xs text-dim font-mono">
          <span>{message.length} / 1600</span>
          <button onClick={() => { setMessage(""); reset(); }} className="hover:text-mid transition-colors">
            Clear
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!message.trim() || loading}
          className="w-full py-3 rounded-xl bg-green text-bg font-bold text-sm tracking-wide hover:bg-green/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing…" : "Analyze Message"}
        </button>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <p className="text-xs text-dim font-mono uppercase tracking-wider">Try an example</p>
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
        {result && <ResultCard result={result} language={language} message={message} />}
      </AnimatePresence>
    </div>
  );
}
