import axios from "axios";
import type {
  DetectResult, ReportResponse, AdminStats,
  DetectionLog, ReportedNumber, FlaggedNumber, FeedbackItem,
  Language, Label,
} from "@/types";

// In dev, Vite proxies /api → http://localhost:8000
// In prod, set VITE_API_BASE in .env (e.g. https://api.fraudlock.ng)
const BASE = import.meta.env.VITE_API_BASE ?? "";

const client = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to admin requests automatically
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("pg_access_token");
  if (token && config.url?.startsWith("/api/admin")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Public API ──────────────────────────────────────────────────────────────
export async function detectSMS(
  message: string,
  language: Language = "en"
): Promise<DetectResult> {
  const { data } = await client.post<DetectResult>("/api/detect/", { message, language });
  return data;
}

export async function getAudioBlob(
  result: { label: string; confidence: number; risk_level: string },
  language: Language = "en"
): Promise<Blob> {
  const response = await client.post(
    "/api/audio/",
    { ...result, language },
    { responseType: "blob" }
  );
  return new Blob([response.data], { type: "audio/mpeg" });
}

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
