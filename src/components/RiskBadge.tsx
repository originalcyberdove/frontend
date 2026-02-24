import clsx from "clsx";
import type { Risk, Label } from "@/types";

export function RiskBadge({ risk }: { risk: Risk }) {
  return (
    <span className={clsx(
      "px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider",
      risk === "High"   && "bg-danger/20 text-danger border border-danger/40",
      risk === "Medium" && "bg-gold/20 text-gold border border-gold/40",
      risk === "Low"    && "bg-green/20 text-green border border-green/40",
    )}>
      {risk}
    </span>
  );
}

export function LabelBadge({ label }: { label: Label }) {
  return (
    <span className={clsx(
      "px-3 py-1 rounded-full text-sm font-bold uppercase tracking-widest",
      label === "spam"       && "bg-danger/15 text-danger border border-danger/40",
      label === "legitimate" && "bg-green/15 text-green border border-green/40",
    )}>
      {label === "spam" ? "⚠ SPAM" : "✓ CLEAN"}
    </span>
  );
}
