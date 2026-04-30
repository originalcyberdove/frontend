// ── Primitives ────────────────────────────────────────────────────────────────

export type Language = "en" | "pid" | "yo" | "ha" | "ig";
export type Label    = "spam" | "legitimate";
export type Risk     = "High" | "Medium" | "Low";
export type Mode     = "ml" | "rule_based";

// ── Raw backend response ──────────────────────────────────────────────────────

export interface RawBackendResult {
  prediction:        string;
  classification:    "phishing" | "suspicious" | "safe";
  spam_probability:  number;
  legit_probability: number;
  confidence:        number;
  message:           string;
  recommendation:    string;
  indicators:        string[];
  risk_score:        number;
  model_loaded:      boolean;
  detection_id:      string;
}

// ── Frontend detection result ─────────────────────────────────────────────────

export interface DetectResult {
  label:          Label;
  confidence:     number;
  risk_level:     Risk;
  keywords:       string[];
  categories:     string[];
  rf_proba:       number;
  svm_proba:      number;
  mode:           Mode;
  detection_id:   string;
  recommendation: string;
  message:        string;
}

// ── Report ────────────────────────────────────────────────────────────────────

export interface ReportResponse {
  success:      boolean;
  report_count: number;
  auto_flagged: boolean;
  threshold:    number;
  message:      string;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export interface AdminStats {
  total_scanned:    number;
  spam_detected:    number;
  legit_detected:   number;
  spam_rate:        number;
  reported_numbers: number;
  flagged_telco:    number;
  feedback_pending: number;
  spam_threshold:   number;
  model_loaded:     boolean;
  model_accuracy:   number | null;
  model_version:    string | null;
}

export interface DetectionLog {
  id:           number;
  detection_id: string;
  label:        Label;
  confidence:   number;
  risk_level:   Risk;
  language:     Language;
  mode:         Mode;
  indicators:   string[];
  timestamp:    string;
}

export interface ReportedNumber {
  number:          string;
  report_count:    number;
  language:        Language;
  predicted_label: string;
  first_reported:  string;
  last_reported:   string;
}

export interface FlaggedNumber {
  number:         string;
  report_count:   number;
  flagged_by:     string;
  flagged_at:     string;
  telco_exported: boolean;
}

export interface FeedbackItem {
  id:              number;
  detection_id:    string;
  original_label:  Label;
  corrected_label: Label;
  language:        Language;
  timestamp:       string;
  processed:       boolean;
}

// ── Number lookup ─────────────────────────────────────────────────────────────

export interface NumberLookupResult {
  found:           boolean;
  number:          string;
  report_count:    number;
  auto_flagged:    boolean;
  predicted_label: string;
  first_reported:  string;
  last_reported:   string;
  flagged_at:      string | null;
  threshold:       number;
  network:         string | null;
  network_code:    string | null;
  dnd:             boolean | null;
  carrier_status:  string | null;
}

export interface DirectoryEntry {
  number:         string;
  report_count:   number;
  auto_flagged:   boolean;
  flagged_at:     string | null;
  first_reported: string;
  last_reported:  string;
}

// ── Display maps ──────────────────────────────────────────────────────────────

export const LANG_LABELS: Record<Language, string> = {
  en:  "English",
  pid: "Pidgin",
  yo:  "Yorùbá",
  ha:  "Hausa",
  ig:  "Igbo",
};

export const CATEGORY_LABELS: Record<string, string> = {
  bank_identity:    "Bank / Identity",
  education_scam:   "Education Scam",
  investment_fraud: "Investment Fraud",
  telecom_fraud:    "Telecom Fraud",
  prize_lottery:    "Prize / Lottery",
  loan_harassment:  "Loan Harassment",
  pos_fraud:        "POS Fraud",
  general_phishing: "General Phishing",
};