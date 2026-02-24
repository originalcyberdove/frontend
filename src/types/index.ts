export type Language = "en" | "pid" | "yo" | "ha" | "ig";
export type Label    = "spam" | "legitimate";
export type Risk     = "Low" | "Medium" | "High";
export type Mode     = "ml" | "rule_based";

export interface DetectResult {
  label:        Label;
  confidence:   number;
  risk_level:   Risk;
  keywords:     string[];
  categories:   string[];
  rf_proba:     number;
  svm_proba:    number;
  mode:         Mode;
  detection_id: string;
}

export interface ReportResponse {
  success:      boolean;
  report_count: number;
  auto_flagged: boolean;
  threshold:    number;
  message:      string;
}

export interface AdminStats {
  total_scanned:    number;
  spam_detected:    number;
  legit_detected:   number;
  spam_rate:        number;
  reported_numbers: number;
  flagged_telco:    number;
  feedback_pending: number;
  model_version:    string;
  model_accuracy:   number;
}

export interface DetectionLog {
  id:         number;
  label:      Label;
  confidence: number;
  risk_level: Risk;
  language:   Language;
  mode:       Mode;
  timestamp:  string;
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
  original_label:  Label;
  corrected_label: Label;
  language:        Language;
  timestamp:       string;
  processed:       boolean;
}

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
