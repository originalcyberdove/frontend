import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { LANG_LABELS } from "@/types";
import type { Language } from "@/types";

interface Props {
  value:    Language;
  onChange: (l: Language) => void;
  compact?: boolean;
}

const LANGS = Object.entries(LANG_LABELS) as [Language, string][];

export default function LanguageSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLabel = LANG_LABELS[value] ?? "English";

  function handleSelect(code: Language) {
    onChange(code);
    setOpen(false);
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-fit" ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className={clsx(
          "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono font-semibold transition-all",
          open
            ? "border-green/50 bg-green/10 text-green"
            : "border-border bg-surface2 text-mid hover:border-green/30 hover:text-white"
        )}
      >
        {/* Globe icon */}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" />
        </svg>

        <span>{currentLabel}</span>

        {/* Chevron */}
        <svg
          className={clsx("w-3 h-3 transition-transform duration-200", open && "rotate-180")}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-2 w-44 border border-border bg-bg/95 backdrop-blur-md shadow-xl overflow-hidden z-50">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-green/50 to-transparent" />

          {LANGS.map(([code, label]) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className={clsx(
                "w-full flex items-center gap-2 px-4 py-2.5 text-xs font-mono transition-all",
                value === code
                  ? "bg-green/10 text-green"
                  : "text-dim hover:bg-surface2 hover:text-white"
              )}
            >
              <span className="flex-1 text-left font-semibold">{label}</span>
              {value === code && (
                <svg className="w-3 h-3 text-green flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}

          <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      )}
    </div>
  );
}