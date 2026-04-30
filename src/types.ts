// ── Primitives ────────────────────────────────────────────────────────────────

export type Language = "en" | "pid" | "yo" | "ha" | "ig";
export type Label    = "spam" | "legitimate";
export type Risk     = "High" | "Medium" | "Low";

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
  mode:           string;
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
  label:        string;
  confidence:   number;
  risk_level:   string;
  language:     string;
  mode:         string;
  indicators:   string[];
  timestamp:    string;
}
export interface ReportedNumber {
  number:          string;
  report_count:    number;
  language:        string;
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
  original_label:  string;
  corrected_label: string;
  language:        string;
  timestamp:       string;
  processed:       boolean;
}