import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";

/*  ICON COMPONENTS (inline SVG — unchanged)             */

const IC = {
  brain: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5m-4.75-11.396c.251.023.501.05.75.082M12 21a8.966 8.966 0 0 0 5.982-2.275M12 21a8.966 8.966 0 0 1-5.982-2.275" />
    </svg>
  ),
  language: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
    </svg>
  ),
  speaker: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
  ),
  signal: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  ),
  bolt: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  ),
  shield: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
  creditCard: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </svg>
  ),
  academic: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a23.838 23.838 0 0 0-1.012 5.434c3.455.798 6.852 1.862 10.14 3.17a47.687 47.687 0 0 1 10.14-3.17 23.84 23.84 0 0 0-1.012-5.434m-18.256 0c.226-.166.46-.324.7-.474A23.918 23.918 0 0 1 12 3.614a23.92 23.92 0 0 1 8.544 2.06c.24.15.474.308.7.473M12 6.75v4.5" />
    </svg>
  ),
  banknotes: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
    </svg>
  ),
  truck: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  ),
  building: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
    </svg>
  ),
  phone: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  ),
  gift: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  ),
  arrowTrending: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  ),
  lockClosed: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  ),
  envelope: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  ),
  warning: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  ),
  check: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  STATIC DATA (icons only — all labels come from translations)      */
/* ------------------------------------------------------------------ */

const FRAUD_ICONS = [
  IC.creditCard, IC.academic, IC.banknotes, IC.truck,
  IC.building,  IC.phone,    IC.gift,      IC.arrowTrending,
  IC.lockClosed, IC.envelope,
];

const FEATURE_ICONS = [IC.brain, IC.language, IC.speaker, IC.signal, IC.bolt, IC.shield];

const PRICING_ACCENTS = ["#00c853", "#f9c84c", "#7aaa88"];
const PRICING_FEATURED = [false, true, false];

const LANGUAGE_CODES = [
  { code: "EN", name: "English" },
  { code: "PCM", name: "Pidgin" },
  { code: "YO", name: "Yoruba" },
  { code: "IG", name: "Igbo" },
  { code: "HA", name: "Hausa" },
];

const COMMUNITY_REPORTS = [
  { n: "08012345678", c: 23, pct: 76,  s: "flagged" as const },
  { n: "07034567890", c: 31, pct: 100, s: "flagged" as const },
  { n: "08098765432", c: 27, pct: 88,  s: "flagged" as const },
  { n: "09087654321", c: 18, pct: 58,  s: "review"  as const },
];

const TELCOS = ["MTN Nigeria", "Airtel", "Glo", "9Mobile", "NCC", "EFCC"];

const gridPattern = {
  backgroundImage: `
    linear-gradient(to right, #162018 1px, transparent 1px),
    linear-gradient(to bottom, #162018 1px, transparent 1px)
  `,
  backgroundSize: "40px 40px",
  backgroundPosition: "center center",
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const { t } = useTranslation();
  const [activeLang, setActiveLang] = useState(0);

  // Build translated arrays from translation keys
  const STATS = [
    { value: "4K+",    label: t("stats_trained") },
    { value: "97.3%",  label: t("stats_accuracy") },
    { value: "< 200ms", label: t("stats_response") },
    { value: "5",      label: t("stats_languages") },
  ];

  const FEATURES = Array.from({ length: 6 }, (_, i) => ({
    icon:  FEATURE_ICONS[i],
    tag:   t(`feature_${i}_tag`),
    title: t(`feature_${i}_title`),
    desc:  t(`feature_${i}_desc`),
  }));

  const FRAUD_TYPES = Array.from({ length: 10 }, (_, i) => ({
    icon:  FRAUD_ICONS[i],
    label: t(`fraud_${i}`),
  }));

  const HOW_IT_WORKS = Array.from({ length: 5 }, (_, i) => ({
    n:     ["01","02","03","04","05"][i],
    title: t(`how_${i}_title`),
    desc:  t(`how_${i}_desc`),
  }));

  const PRICING = Array.from({ length: 3 }, (_, i) => ({
    tier:     t(`pricing_${i}_tier`),
    price:    t(`pricing_${i}_price`),
    sub:      t(`pricing_${i}_sub`),
    cta:      t(`pricing_${i}_cta`),
    accent:   PRICING_ACCENTS[i],
    featured: PRICING_FEATURED[i],
    features: Array.from({ length: 5 }, (_, j) => t(`pricing_${i}_f${j}`)),
  }));

  return (
    <>
      {/* ========== HERO ========== */}
      <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none" style={gridPattern} />
        <div className="absolute inset-0 z-0 bg-radial-vignette pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-24 pt-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-1 lg:col-span-7 flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 self-start border border-green/30 bg-green/5 text-green text-xs font-mono px-3 py-1.5 rounded-full uppercase tracking-widest leading-none">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
              {t("hero_badge")}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white uppercase leading-[1.05] drop-shadow-lg">
              {t("hero_title_1")} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green to-dim">
                {t("hero_title_2")}
              </span>
              <br /> {t("hero_title_3")}
            </h1>

            <p className="text-lg md:text-xl text-dim font-mono max-w-xl leading-relaxed mt-2 border-l-2 border-green/50 pl-4 py-1">
              {t("hero_subtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <Link
                to="/detect"
                className="relative overflow-hidden group inline-flex items-center justify-center gap-3 px-8 py-4 bg-green text-bg font-bold uppercase tracking-wider hover:bg-[#00e65f] transition-all rounded-none border border-green hover:shadow-[0_0_24px_rgba(0,200,83,0.4)]"
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPgo8cmVjdCB3aWR0aD0nNCcgaGVpZ2h0PSc0JyBmaWxsPSd0cmFuc3BhcmVudCcvPgo8cmVjdCB3aWR0aD0nMScgaGVpZ2h0PScxJyBmaWxsPSdyZ2JhKDAsMCwwLDAuMSknLz4KPC9zdmc+')] opacity-50 mix-blend-overlay group-hover:opacity-100 transition-opacity" />
                <span>{t("hero_cta_analyze")}</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                to="/report"
                className="px-8 py-4 bg-transparent border border-border text-white hover:border-dim hover:bg-surface2 transition-all font-mono uppercase text-sm tracking-wider"
              >
                {t("hero_cta_reports")}
              </Link>
            </div>
          </motion.div>

          {/* Right Column (Bento) — static, no text changes needed */}
          <div className="col-span-1 lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, rotateY: 15, z: -100 }}
              animate={{ opacity: 1, rotateY: 0, z: 0 }}
              transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
              className="grid grid-cols-2 gap-4 relative perspective-[1000px]"
            >
              <div className="absolute -top-12 -right-12 text-border font-mono text-[10rem] font-bold leading-none opacity-20 pointer-events-none select-none z-0">
                01
              </div>
              <div className="col-span-2 p-6 border border-border bg-surface/80 backdrop-blur-sm relative overflow-hidden group hover:border-green/50 transition-colors z-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-8">
                  <div className="w-10 h-10 border border-border bg-bg flex items-center justify-center text-green">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono text-dim tracking-widest uppercase">{t("bento_secure")}</span>
                </div>
                <h3 className="font-bold text-lg mb-1 uppercase tracking-wide">{t("bento_sandbox_title")}</h3>
                <p className="text-sm font-mono text-dim">{t("bento_sandbox_desc")}</p>
              </div>
              <div className="col-span-1 p-6 border border-border bg-surface/80 backdrop-blur-sm relative overflow-hidden group hover:border-gold/50 transition-colors z-10">
                <div className="mb-6 w-8 h-8 flex items-center justify-center text-gold border border-gold/20 bg-gold/5 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base uppercase">{t("bento_realtime_title")}</h3>
                <p className="text-xs font-mono text-dim mt-2">{t("bento_realtime_desc")}</p>
              </div>
              <div className="col-span-1 p-6 border border-border bg-surface/80 backdrop-blur-sm relative overflow-hidden group hover:border-danger/50 transition-colors z-10">
                <div className="mb-6 w-8 h-8 flex items-center justify-center text-danger border border-danger/20 bg-danger/5 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base uppercase">{t("bento_heuristics_title")}</h3>
                <p className="text-xs font-mono text-dim mt-2">{t("bento_heuristics_desc")}</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green/20 to-transparent" />
      </div>

      {/* ========== STATS BAR ========== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full border-y border-border bg-surface/60 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green tracking-tight">{s.value}</div>
              <div className="text-xs font-mono text-mid uppercase tracking-widest mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ========== FEATURES ========== */}
      <section id="features" className="w-full max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block text-[10px] font-mono text-green uppercase tracking-[0.2em] border border-green/20 bg-green/5 px-3 py-1 rounded-full mb-4">
            {t("features_tag")}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
            {t("features_title_1")}<br />{t("features_title_2")}
          </h2>
          <p className="text-mid font-mono text-sm md:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            {t("features_subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative p-6 border border-border bg-surface/60 backdrop-blur-sm hover:border-green/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-green mb-3">{f.icon}</div>
              <div className="inline-block text-[9px] font-mono text-mid uppercase tracking-[0.15em] border border-green/15 bg-green/5 px-2 py-0.5 rounded-full mb-3">
                {f.tag}
              </div>
              <h3 className="font-bold text-base text-white uppercase tracking-wide mb-2">{f.title}</h3>
              <p className="text-xs font-mono text-dim leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== FRAUD TICKER ========== */}
      <div className="w-full border-y border-border bg-surface/40 py-10 overflow-hidden">
        <div className="text-center mb-6">
          <div className="inline-block text-[10px] font-mono text-danger uppercase tracking-[0.2em] border border-danger/20 bg-danger/5 px-3 py-1 rounded-full">
            {t("fraud_ticker_label")}
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-4 animate-[scroll_30s_linear_infinite] w-max">
            {[...FRAUD_TYPES, ...FRAUD_TYPES, ...FRAUD_TYPES].map((f, i) => (
              <div
                key={i}
                className="flex-shrink-0 inline-flex items-center gap-2.5 px-5 py-2.5 border border-border bg-bg/80 text-sm font-mono text-mid hover:border-danger/40 hover:text-white transition-colors whitespace-nowrap"
              >
                <span className="text-danger">{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="w-full py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block text-[10px] font-mono text-gold uppercase tracking-[0.2em] border border-gold/20 bg-gold/5 px-3 py-1 rounded-full mb-4">
              {t("how_tag")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white">
              {t("how_title")}
            </h2>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-border via-green/30 to-border z-0" />
            {HOW_IT_WORKS.map((st, i) => (
              <motion.div
                key={st.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative z-10 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-green/40 bg-bg rounded-full flex items-center justify-center text-green font-mono font-bold text-lg">
                  {st.n}
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wide text-white mb-2">{st.title}</h3>
                <p className="text-xs font-mono text-dim leading-relaxed">{st.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== LANGUAGES ========== */}
      <section id="languages" className="w-full bg-surface py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block text-[10px] font-mono text-green uppercase tracking-[0.2em] border border-green/20 bg-green/5 px-3 py-1 rounded-full mb-4">
                {t("lang_tag")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white leading-tight mb-4">
                {t("lang_title_1")}<br />{t("lang_title_2")}
              </h2>
              <p className="text-mid font-mono text-sm leading-relaxed mb-8">
                {t("lang_subtitle")}
              </p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_CODES.map((l, i) => (
                  <button
                    key={l.code}
                    onClick={() => setActiveLang(i)}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-all duration-200 ${
                      activeLang === i
                        ? "border-green bg-green/10 text-white"
                        : "border-border text-dim hover:border-dim hover:text-mid"
                    }`}
                  >
                    {l.code} · {l.name}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="border border-border bg-bg/80 backdrop-blur-sm p-6"
            >
              <div className="text-[10px] font-mono text-dim uppercase tracking-widest mb-3">
                {t("lang_sample_label")} · {LANGUAGE_CODES[activeLang].name}
              </div>
              <div className="text-white font-mono text-sm leading-relaxed border-l-2 border-danger/50 pl-4 py-2 mb-6 bg-danger/5">
                "{t(`lang_${activeLang}_sample`)}"
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-danger/10 border border-danger/30 text-danger text-xs font-mono uppercase tracking-wider">
                  <span className="flex-shrink-0">{IC.warning}</span> {t("lang_result_spam")}
                </span>
                <span className="text-xs font-mono text-white">{t("lang_result_confidence")}</span>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-danger">
                  <span className="w-2 h-2 rounded-full bg-danger inline-block" /> {t("lang_result_risk")}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== COMMUNITY ========== */}
      <section id="community" className="w-full max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block text-[10px] font-mono text-gold uppercase tracking-[0.2em] border border-gold/20 bg-gold/5 px-3 py-1 rounded-full mb-4">
            {t("community_tag")}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
            {t("community_title_1")}<br />{t("community_title_2")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Trans component handles the <strong> tag inside the translation string */}
            <p className="text-mid font-mono text-sm leading-relaxed mb-5">
              <Trans
                i18nKey="community_body_1"
                components={{ 1: <strong className="text-white" /> }}
              />
            </p>
            <p className="text-mid font-mono text-sm leading-relaxed">
              {t("community_body_2")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-border bg-surface/60 backdrop-blur-sm overflow-hidden"
          >
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-bg/50">
              <div className="w-2.5 h-2.5 rounded-full bg-danger" />
              <span className="text-xs font-mono text-mid uppercase tracking-widest">{t("community_table_title")}</span>
            </div>
            <div className="divide-y divide-border">
              {COMMUNITY_REPORTS.map(r => (
                <div key={r.n} className="flex items-center gap-4 px-5 py-3">
                  <span className="text-xs font-mono text-mid flex-shrink-0 w-28">{r.n}</span>
                  <span className="text-[10px] font-mono text-dim w-8 text-right">{r.c}</span>
                  <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${r.pct}%`, background: r.s === "flagged" ? "#e53935" : "#f9c84c" }}
                    />
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider flex-shrink-0 ${
                    r.s === "flagged" ? "text-danger" : "text-gold"
                  }`}>
                    <span className={`w-2 h-2 rounded-full inline-block ${r.s === "flagged" ? "bg-danger" : "bg-gold"}`} />
                    {r.s === "flagged" ? t("community_flagged") : t("community_review")}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-border text-center">
              <span className="text-[10px] font-mono text-mid">
                {t("community_threshold")} <span className="text-white font-bold">{t("community_threshold_value")}</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="pricing" className="w-full bg-surface py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block text-[10px] font-mono text-green uppercase tracking-[0.2em] border border-green/20 bg-green/5 px-3 py-1 rounded-full mb-4">
              {t("pricing_tag")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
              {t("pricing_title_1")}<br />{t("pricing_title_2")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative border bg-bg/60 backdrop-blur-sm overflow-hidden transition-all duration-300 group ${
                  p.featured
                    ? "border-gold/50 shadow-[0_0_30px_rgba(249,200,76,0.08)] scale-[1.02]"
                    : "border-border hover:border-green/30"
                }`}
              >
                <div className="h-1 w-full" style={{ background: p.accent }} />
                <div className="p-8">
                  <div className="text-xs font-mono uppercase tracking-[0.15em] mb-1" style={{ color: p.accent }}>
                    {p.tier}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{p.price}</div>
                  <div className="text-xs font-mono text-dim mb-8">{p.sub}</div>
                  <div className="space-y-3 mb-8">
                    {p.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm font-mono text-mid">
                        <span className="text-green mt-0.5 flex-shrink-0">{IC.check}</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className={`w-full py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                      p.featured
                        ? "text-bg hover:opacity-90"
                        : "border border-border text-white hover:border-dim hover:bg-surface2"
                    }`}
                    style={p.featured ? { background: p.accent } : {}}
                  >
                    {p.cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <div className="w-full py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green/[0.03] to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white leading-tight mb-4">
            {t("cta_title_1")}<br />{t("cta_title_2")}
          </h2>
          <p className="text-mid font-mono text-sm mb-8">{t("cta_subtitle")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Link
              to="/detect"
              className="px-8 py-4 bg-green text-bg font-bold uppercase tracking-wider hover:bg-[#00e65f] transition-all border border-green hover:shadow-[0_0_24px_rgba(0,200,83,0.4)]"
            >
              {t("cta_start")}
            </Link>
            <button className="px-8 py-4 bg-transparent border border-border text-white hover:border-dim hover:bg-surface2 transition-all font-mono uppercase text-sm tracking-wider">
              {t("cta_partner")}
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {TELCOS.map(telco => (
              <span
                key={telco}
                className="px-4 py-1.5 border border-border text-[10px] font-mono text-dim uppercase tracking-widest hover:border-green/30 hover:text-mid transition-colors"
              >
                {telco}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ========== FOOTER ========== */}
      <footer className="w-full border-t border-border py-10 text-center">
        <div className="font-bold text-white text-lg tracking-tight mb-2">
          Fraud<span className="text-green">lock</span>
        </div>
        <div className="text-xs font-mono text-mid">
          {t("footer_tagline")}
        </div>
      </footer>
    </>
  );
}