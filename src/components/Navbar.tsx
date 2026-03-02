import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { Language } from "@/types";

const LANG_OPTIONS: { code: Language; label: string; native: string }[] = [
  { code: "en",  label: "EN",  native: "English" },
  { code: "pid", label: "PID", native: "Pidgin"  },
  { code: "yo",  label: "YO",  native: "Yorùbá"  },
  { code: "ha",  label: "HA",  native: "Hausa"   },
  { code: "ig",  label: "IG",  native: "Igbo"    },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = i18n.language.split("-")[0] as Language;
  const currentOption = LANG_OPTIONS.find(l => l.code === currentLang) ?? LANG_OPTIONS[0];

  const LINKS = [
  { to: "/detect",  label: t("nav_detect")  },
  { to: "/numbers", label: t("nav_numbers") },
  { to: "/report",  label: t("nav_report")  },
];

  function handleLangChange(code: Language) {
    i18n.changeLanguage(code);
    setOpen(false);
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-green flex items-center justify-center text-bg font-black text-sm">
            F
          </div>
          <span className="font-bold text-white tracking-tight">
            Fraud<span className="text-green">lock</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1">
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                pathname === to
                  ? "bg-green/10 text-green"
                  : "text-dim hover:text-mid hover:bg-surface2"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Language dropdown */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setOpen(prev => !prev)}
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all",
              open
                ? "border-green/50 bg-green/10 text-green"
                : "border-border text-dim hover:border-green/30 hover:text-mid"
            )}
          >
            {/* Globe icon */}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" />
            </svg>

            <span>{currentOption.label}</span>

            {/* Chevron */}
            <svg
              className={clsx("w-3 h-3 transition-transform duration-200", open && "rotate-180")}
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 border border-border bg-bg/95 backdrop-blur-md shadow-xl overflow-hidden z-50">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-green/50 to-transparent" />

              {LANG_OPTIONS.map(({ code, label, native }) => (
                <button
                  key={code}
                  onClick={() => handleLangChange(code)}
                  className={clsx(
                    "w-full flex items-center gap-2 px-4 py-2.5 text-xs font-mono transition-all",
                    currentLang === code
                      ? "bg-green/10 text-green"
                      : "text-dim hover:bg-surface2 hover:text-white"
                  )}
                >
                  <span className="font-semibold tracking-wider w-8">{label}</span>
                  <span className="text-[10px] opacity-70 flex-1 text-left">{native}</span>
                  {currentLang === code && (
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

      </div>
    </nav>
  );
}