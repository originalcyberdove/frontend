// CarrierBadge.tsx — inline SVG logos, no external requests needed

interface Props {
  network: string;
}

const CARRIERS: Record<string, {
  color: string;
  bg: string;
  border: string;
  svg: React.ReactNode;
}> = {
  "MTN": {
    color:  "#d4a800",
    bg:     "rgba(212,168,0,0.12)",
    border: "rgba(212,168,0,0.35)",
    svg: (
      <svg viewBox="0 0 40 20" className="h-4 w-auto">
        <rect width="40" height="20" rx="3" fill="#FFCC00"/>
        <text x="20" y="14" textAnchor="middle" fontSize="10"
          fontWeight="900" fontFamily="Arial,sans-serif" fill="#000">
          MTN
        </text>
      </svg>
    ),
  },
  "Airtel": {
    color:  "#e00000",
    bg:     "rgba(224,0,0,0.10)",
    border: "rgba(224,0,0,0.30)",
    svg: (
      <svg viewBox="0 0 40 20" className="h-4 w-auto">
        <rect width="40" height="20" rx="3" fill="#FF0000"/>
        <text x="20" y="14" textAnchor="middle" fontSize="8"
          fontWeight="900" fontFamily="Arial,sans-serif" fill="#fff">
          airtel
        </text>
      </svg>
    ),
  },
  "Glo": {
    color:  "#008000",
    bg:     "rgba(0,128,0,0.10)",
    border: "rgba(0,128,0,0.30)",
    svg: (
      <svg viewBox="0 0 40 20" className="h-4 w-auto">
        <rect width="40" height="20" rx="3" fill="#009900"/>
        <text x="20" y="14" textAnchor="middle" fontSize="11"
          fontWeight="900" fontFamily="Arial,sans-serif" fill="#fff">
          glo
        </text>
      </svg>
    ),
  },
  "Etisalat": {
    color:  "#ff6600",
    bg:     "rgba(255,102,0,0.10)",
    border: "rgba(255,102,0,0.30)",
    svg: (
      <svg viewBox="0 0 50 20" className="h-4 w-auto">
        <rect width="50" height="20" rx="3" fill="#FF6600"/>
        <text x="25" y="14" textAnchor="middle" fontSize="7.5"
          fontWeight="900" fontFamily="Arial,sans-serif" fill="#fff">
          9mobile
        </text>
      </svg>
    ),
  },
  "9mobile": {
    color:  "#ff6600",
    bg:     "rgba(255,102,0,0.10)",
    border: "rgba(255,102,0,0.30)",
    svg: (
      <svg viewBox="0 0 50 20" className="h-4 w-auto">
        <rect width="50" height="20" rx="3" fill="#FF6600"/>
        <text x="25" y="14" textAnchor="middle" fontSize="7.5"
          fontWeight="900" fontFamily="Arial,sans-serif" fill="#fff">
          9mobile
        </text>
      </svg>
    ),
  },
};

export default function CarrierBadge({ network }: Props) {
  const cfg = CARRIERS[network];

  if (!cfg) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono"
        style={{ background: "var(--surface2)", borderColor: "var(--border)", color: "var(--mid)" }}>
        📶 {network}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-mono font-semibold"
      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}
    >
      {cfg.svg}
      {network}
    </span>
  );
}