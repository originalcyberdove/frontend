import { useState, useCallback } from "react";
import { detectSMS } from "@/lib/api";
import type { DetectResult, Language } from "@/types";

interface State {
  result:  DetectResult | null;
  loading: boolean;
  error:   string | null;
}

export function useDetect() {
  const [state, setState] = useState<State>({ result: null, loading: false, error: null });

  const analyze = useCallback(async (message: string, language: Language) => {
    if (!message.trim()) return;
    setState({ result: null, loading: true, error: null });
    try {
      const result = await detectSMS(message, language);
      setState({ result, loading: false, error: null });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Detection failed. Is the backend running?";
      setState({ result: null, loading: false, error: msg });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ result: null, loading: false, error: null });
  }, []);

  return { ...state, analyze, reset };
}
