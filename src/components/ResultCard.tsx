import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LabelBadge, RiskBadge } from "./RiskBadge";
import { useAudio } from "@/hooks/useAudio";
import { submitFeedback } from "@/lib/api";
import { useState } from "react";
import clsx from "clsx";
import type { DetectResult, Language, Label, Mode } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface Props {
  result:   DetectResult;
  language: Language;
  message:  string;
}

export default function ResultCard({ result, language, message }: Props) {
  const { play, playing, loading: audioLoading } = useAudio();
  const [feedbackSent,  setFeedbackSent]  = useState(false);
  const [feedbackError, setFeedbackError] = useState(false);

  const isSpam = result.label === "spam";
  const accent = isSpam ? "danger" : "green";

  async function handleFeedback(corrected: Label) {
    try {
      await submitFeedback(result.detection_id, result.label, corrected, language);
      setFeedbackSent(true);
    } catch {
      setFeedbackError(true);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={clsx(
        "rounded-2xl border p-6 space-y-5",
        isSpam
          ? "bg-danger/5 border-danger/30"
          : "bg-green/5 border-green/30"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isSpam ? "🚨" : "✅"}</span>
          <LabelBadge label={result.label} />
          <RiskBadge risk={result.risk_level} />
        </div>
        <button
          onClick={() => play(result, language)}
          disabled={audioLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface2 text-mid hover:text-green hover:border-green text-sm font-mono transition-all disabled:opacity-50"
        >
          {audioLoading ? "⏳" : playing ? "⏸" : "🔊"}
          <span>{playing ? "Stop" : "Listen"}</span>
        </button>
      </div>

      {/* Confidence bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-mono text-mid">
          <span>Confidence</span>
          <span className={isSpam ? "text-danger" : "text-green"}>{result.confidence}%</span>
        </div>
        <div className="h-2 rounded-full bg-surface2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={clsx(
              "h-full rounded-full",
              isSpam ? "bg-danger" : "bg-green"
            )}
          />
        </div>
        <div className="flex justify-between text-xs text-dim font-mono">
          <span>RF: {result.rf_proba}%</span>
          <span>SVM: {result.svm_proba}%</span>
          <span className="capitalize">{result.mode === "ml" ? "🤖 ML Model" : "📋 Rule Engine"}</span>
        </div>
      </div>

      {/* Keywords */}
      {result.keywords.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-mono text-dim uppercase tracking-wider">Suspicious Keywords</p>
          <div className="flex flex-wrap gap-2">
            {result.keywords.map((kw) => (
              <span key={kw} className="px-2 py-1 rounded-md bg-danger/10 border border-danger/25 text-danger text-xs font-mono">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {result.categories.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-mono text-dim uppercase tracking-wider">Fraud Categories</p>
          <div className="flex flex-wrap gap-2">
            {result.categories.map((cat) => (
              <span key={cat} className="px-2 py-1 rounded-md bg-surface2 border border-border text-mid text-xs font-mono">
                {CATEGORY_LABELS[cat] ?? cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      <div className="pt-2 border-t border-border">
        {feedbackSent ? (
          <p className="text-xs text-green font-mono">✓ Feedback recorded. Thank you!</p>
        ) : feedbackError ? (
          <p className="text-xs text-danger font-mono">Failed to send feedback.</p>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-dim font-mono">Wrong result?</span>
              <button
                onClick={() => handleFeedback(result.label === "spam" ? "legitimate" : "spam")}
                className="text-xs font-mono text-mid hover:text-gold border border-border hover:border-gold px-2 py-1 rounded transition-all"
              >
                Mark as {result.label === "spam" ? "Legitimate" : "Spam"}
              </button>
            </div>
            
            {isSpam && (
              <Link 
                to="/report" 
                state={{ message }}
                className="px-3 py-1.5 text-xs font-bold font-mono tracking-wider uppercase text-bg bg-danger hover:bg-danger/90 rounded transition-all inline-flex items-center gap-2 self-start sm:self-auto"
              >
                <span>Report Number</span>
                <span className="text-bg">→</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
