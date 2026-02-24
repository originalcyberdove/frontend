import { LANG_LABELS } from "@/types";
import type { Language } from "@/types";
import clsx from "clsx";

interface Props {
  value:    Language;
  onChange: (l: Language) => void;
  compact?: boolean;
}

const LANGS = Object.entries(LANG_LABELS) as [Language, string][];

export default function LanguageSelector({ value, onChange, compact }: Props) {
  return (
    <div className={clsx("flex gap-1 flex-wrap", compact && "gap-1")}>
      {LANGS.map(([code, label]) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          className={clsx(
            "px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all border",
            value === code
              ? "bg-green text-bg border-green"
              : "bg-surface2 text-mid border-border hover:border-green hover:text-green"
          )}
        >
          {compact ? code.toUpperCase() : label}
        </button>
      ))}
    </div>
  );
}
