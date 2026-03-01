import { useState, useRef, useCallback } from "react";
import { getAudioBlob } from "@/lib/api";
import type { Language } from "@/types";

export function useAudio() {
  const [playing,  setPlaying]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(async (
    result: { label: string; confidence: number; risk_level: string; recommendation?: string },
    language: Language
  ) => {
    // Toggle off if already playing
    if (playing) {
      audioRef.current?.pause();
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try YarnGPT via backend
      const blob = await getAudioBlob(result, language);
      const url  = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audioRef.current = audio;
      audio.onended = () => { setPlaying(false); URL.revokeObjectURL(url); };
      audio.onerror = () => { setPlaying(false); setError("Audio playback failed."); };

      await audio.play();
      setPlaying(true);
    } catch {
      // Fallback to browser TTS if YarnGPT fails
      try {
        const spoken = buildFallbackText(
          result.label,
          result.confidence,
          result.risk_level,
          result.recommendation ?? '',
          language,
        );
        const utter  = new SpeechSynthesisUtterance(spoken);
        utter.lang   = langMap[language] ?? "en-NG";
        utter.rate   = 0.88;
        utter.onend  = () => setPlaying(false);
        window.speechSynthesis.speak(utter);
        setPlaying(true);
      } catch {
        setError("Audio unavailable.");
        setPlaying(false);
      }
    } finally {
      setLoading(false);
    }
  }, [playing]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    window.speechSynthesis.cancel();
    setPlaying(false);
  }, []);

  return { play, stop, playing, loading, error };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const langMap: Record<string, string> = {
  en: "en-NG", pid: "en-NG", yo: "yo", ha: "ha", ig: "ig",
};

function buildFallbackText(
  label: string,
  confidence: number,
  risk: string,
  recommendation: string,
  lang: string,
): string {
  const c = Math.round(confidence);
  const rec = recommendation || '';

  const templates: Record<string, Record<string, string>> = {
    en: {
      spam:       `Warning! This SMS is spam. Confidence ${c} percent. Risk: ${risk}. ${rec}`,
      legitimate: `This message appears legitimate. Confidence ${c} percent. ${rec}`,
    },
    pid: {
      spam:       `Warning! This SMS na scam. ${c} percent confidence. Risk: ${risk}. ${rec}`,
      legitimate: `This message dey clean. ${c} percent confidence. ${rec}`,
    },
    yo: {
      spam:       `Ìkìlọ̀! Ifiranṣẹ yii jẹ spam. Igbẹkẹle ${c} ogorun. Ipele ewu: ${risk}.`,
      legitimate: `Ifiranṣẹ yii dabi ẹnipe o jẹ gidi. Igbẹkẹle ${c} ogorun.`,
    },
    ha: {
      spam:       `Gargadi! Wannan SMS zamba ne. Tabbas ${c} bisa dari. Haɗari: ${risk}.`,
      legitimate: `Wannan sakon yana da inganci. Tabbas ${c} bisa dari.`,
    },
    ig: {
      spam:       `Ọ dị njọ! Ozi a bụ aghụghọ. Ntụkwasị obi ${c} n'otu narị. Ihe egwu: ${risk}.`,
      legitimate: `Ozi a yiri ka ọ dị mọọ. Ntụkwasị obi ${c} n'otu narị.`,
    },
  };

  return templates[lang]?.[label] ?? templates.en[label] ?? '';
}