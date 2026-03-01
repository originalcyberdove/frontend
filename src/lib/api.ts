import axios from "axios";
import type {
  DetectResult, RawBackendResult, ReportResponse,
  AdminStats, DetectionLog, ReportedNumber, FlaggedNumber,
  FeedbackItem, Language, Label, Risk,
} from "@/types";

// In dev, Vite proxies /api → http://localhost:8000
// In prod, set VITE_API_BASE in .env (e.g. https://api.fraudlock.ng)
const BASE = import.meta.env.VITE_API_BASE ?? "";

const client = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Map backend classification → frontend label */
function toLabel(cls: RawBackendResult["classification"]): Label {
  return cls === "safe" ? "legitimate" : "spam";
}

/** Map backend risk_score → frontend Risk enum */
function toRisk(score: number, cls: RawBackendResult["classification"]): Risk {
  if (cls === "phishing" || score >= 8) return "High";
  if (cls === "suspicious" || score >= 4) return "Medium";
  return "Low";
}

/** Map indicator keywords to fraud category slugs for the UI */
function toCategories(indicators: string[]): string[] {
  const mapping: Record<string, string> = {
    bvn: "bank_identity", "account number": "bank_identity", pin: "bank_identity",
    password: "bank_identity", atm: "bank_identity", bank: "bank_identity",
    jamb: "education_scam",
    prize: "prize_lottery", winner: "prize_lottery", won: "prize_lottery",
    congratulations: "prize_lottery", reward: "prize_lottery",
    free: "prize_lottery", cash: "investment_fraud",
  };
  const cats = new Set<string>();
  for (const ind of indicators) {
    const cat = mapping[ind.toLowerCase()];
    if (cat) cats.add(cat);
  }
  return [...cats];
}

/** Generate a simple client-side detection ID (backend doesn't provide one) */
function generateDetectionId(): string {
  return `det_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Detect SMS fraud via POST /api/check-message/
 * Maps the raw backend response into the DetectResult shape
 * the rest of the frontend expects.
 */
export async function detectSMS(
  message: string,
  language: Language = "en"
): Promise<DetectResult> {
  const { data } = await client.post<RawBackendResult>("/api/check-message/", {
    message,
    language,
  });

  return {
    label:          toLabel(data.classification),
    confidence:     data.confidence,
    risk_level:     toRisk(data.risk_score, data.classification),
    keywords:       data.indicators,
    categories:     toCategories(data.indicators),
    rf_proba:       data.spam_probability,
    svm_proba:      data.legit_probability,
    mode:           data.model_loaded ? "ml" : "rule_based",
    detection_id:   generateDetectionId(),
    recommendation: data.recommendation,
    message:        data.message,
  };
}

/**
 * Get audio blob for TTS.
 */
export async function getAudioBlob(
  result: { label: string; confidence: number; risk_level: string; recommendation?: string },
  language: Language = "en"
): Promise<Blob> {
  const response = await client.post(
    "/api/audio/",
    {
      label:          result.label,
      confidence:     result.confidence,
      risk_level:     result.risk_level,
      recommendation: (result as any).recommendation ?? "",
      language,
    },
    { responseType: "blob" }
  );
  return new Blob([response.data], { type: "audio/mpeg" });
}
/**
 * Report a scam number.
 * Will work automatically once backend adds POST /api/report/.
 */
export async function reportNumber(
  number: string,
  message: string,
  language: Language,
  predicted_label?: Label
): Promise<ReportResponse> {
  const { data } = await client.post<ReportResponse>("/api/report/", {
    number, message, language, predicted_label,
  });
  return data;
}

/**
 * Submit feedback on a detection result.
 * Will work automatically once backend adds POST /api/feedback/.
 */
export async function submitFeedback(
  detection_id: string,
  original_label: Label,
  corrected_label: Label,
  language: Language
): Promise<void> {
  await client.post("/api/feedback/", {
    detection_id, original_label, corrected_label, language,
  });
}

// ── Auth ────────────────────────────────────────────────────────────────────

/**
 * Admin login via JWT.
 * Will work automatically once backend adds POST /api/auth/token/.
 */
export async function loginAdmin(
  username: string,
  password: string
): Promise<void> {
  const { data } = await client.post<{ access: string; refresh: string }>(
    "/api/auth/token/",
    { username, password }
  );
  localStorage.setItem("pg_access_token",  data.access);
  localStorage.setItem("pg_refresh_token", data.refresh);
}

export function logoutAdmin(): void {
  localStorage.removeItem("pg_access_token");
  localStorage.removeItem("pg_refresh_token");
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("pg_access_token");
}

// ── Admin API ───────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await client.get<AdminStats>("/api/admin/stats/");
  return data;
}

export async function getAdminLogs(limit = 50): Promise<DetectionLog[]> {
  const { data } = await client.get<DetectionLog[]>(`/api/admin/logs/?limit=${limit}`);
  return data;
}

export async function getAdminNumbers(): Promise<{
  reported: ReportedNumber[];
  flagged: FlaggedNumber[];
}> {
  const { data } = await client.get("/api/admin/numbers/");
  return data;
}

export async function getAdminFeedback(): Promise<FeedbackItem[]> {
  const { data } = await client.get<FeedbackItem[]>("/api/admin/feedback/");
  return data;
}

export function getExportURL(): string {
  return `${BASE}/api/admin/export/`;
}