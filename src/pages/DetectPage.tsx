import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDetect } from "@/hooks/useDetect";
import { useAudio } from "@/hooks/useAudio";
import ResultCard from "@/components/ResultCard";
import LanguageSelector from "@/components/LanguageSelector";
import type { Language } from "@/types";

const EXAMPLES = [
  "Dear customer, your GTB account has been suspended. Verify your BVN and OTP immediately at gtb-verify.net to avoid losing your funds.",
  "JAMB: Your result has been upgraded to 280. Pay N3500 to claim. Call 08012345678 now.",
  "Hi Emeka, are we still on for the meeting tomorrow at 3pm? Let me know if the time works.",
  "Congratulations! You have won N500000 in the MTN WhatsApp lottery. Send your bank details to claim.",
];

const SCAN_COMMANDS: Record<Language, string[]> = {
  en:  ["scan", "check", "analyze", "detect"],
  pid: ["scan", "check am", "check"],
  yo:  ["scan", "ṣayẹwo", "check"],
  ha:  ["scan", "bincika", "check"],
  ig:  ["scan", "chọpụta", "check"],
};

export default function DetectPage() {
  const { t, i18n } = useTranslation();
  const { play } = useAudio();

  const normalise = (code: string): Language => {
    const base = code.split("-")[0] as Language;
    const valid: Language[] = ["en", "pid", "yo", "ha", "ig"];
    return valid.includes(base) ? base : "en";
  };

  const [message,    setMessage]    = useState("");
  const [language,   setLanguage]   = useState<Language>(normalise(i18n.language));
  const [autoPlay,   setAutoPlay]   = useState(() =>
    localStorage.getItem("fraudlock_autoplay") === "false"
  );
  const [listening,  setListening]  = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceHint,  setVoiceHint]  = useState<string | null>(null);

  const { result, loading, error, analyze, reset } = useDetect();
  const recognitionRef = useRef<any>(null);

  function handleLanguageChange(lang: Language) {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }

  useEffect(() => {
    setLanguage(normalise(i18n.language));
  }, [i18n.language]);

  // Auto-play when result arrives
  useEffect(() => {
    if (result && autoPlay) {
      play(result, language);
    }
  }, [result]);

  function toggleAutoPlay() {
    const next = !autoPlay;
    setAutoPlay(next);
    localStorage.setItem("fraudlock_autoplay", String(next));
  }

  function handleSubmit() {
    if (!message.trim() || loading) return;
    analyze(message, language);
  }

  function loadExample(ex: string) {
    setMessage(ex);
    reset();
  }

  // ── Voice command ──────────────────────────────────────────────────────────

  const langToSpeechCode: Record<Language, string> = {
    en: "en-NG", pid: "en-NG", yo: "yo", ha: "ha", ig: "ig",
  };

  function startListening() {
    setVoiceError(null);
    setVoiceHint(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(t("detect_mic_unsupported"));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang            = langToSpeechCode[language] ?? "en-NG";
    recognition.interimResults  = false;
    recognition.maxAlternatives = 1;
    recognition.continuous      = true;

    recognition.onstart = () => {
      setListening(true);
      setVoiceHint(t("detect_voice_hint"));
    };

    recognition.onresult = (e: any) => {
      const transcript = e.results[e.results.length - 1][0].transcript
        .toLowerCase()
        .trim();

      const commands = SCAN_COMMANDS[language] ?? SCAN_COMMANDS.en;
      const isCommand = commands.some(cmd => transcript.includes(cmd));

      if (isCommand && message.trim()) {
        recognition.stop();
        setVoiceHint(null);
        analyze(message, language);
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error !== "no-speech") {
        setVoiceError(`Mic error: ${e.error}`);
      }
      setListening(false);
      setVoiceHint(null);
    };

    recognition.onend = () => {
      setListening(false);
      setVoiceHint(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
    setVoiceHint(null);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">
          {t("detect_title_1")} <span className="text-green">{t("detect_title_2")}</span>
        </h1>
        <p className="text-mid text-sm">{t("detect_subtitle")}</p>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => { setMessage(e.target.value); reset(); }}
            placeholder={t("detect_placeholder")}
            rows={5}
            maxLength={1600}
            className="w-full bg-surface2 border border-border rounded-xl p-4 pr-12 text-white placeholder-dim font-mono text-sm resize-none focus:outline-none focus:border-green transition-colors"
          />

          {/* Mic button inside textarea */}
          <button
            onClick={listening ? stopListening : startListening}
            aria-label={listening ? t("detect_mic_stop") : t("detect_mic_start")}
            title={listening ? t("detect_mic_stop") : t("detect_mic_start")}
            className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
              listening
                ? "bg-danger/20 border-danger/50 text-danger animate-pulse"
                : "bg-surface2 border-border text-dim hover:text-green hover:border-green"
            }`}
          >
            {listening ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            )}
          </button>
        </div>

        

        {/* Voice error */}
        <AnimatePresence>
          {voiceError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-danger font-mono"
            >
              ⚠ {voiceError}
            </motion.p>
          )}
        </AnimatePresence>

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