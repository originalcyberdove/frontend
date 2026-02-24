import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const LINKS = [
  { to: "/detect", label: "Detect" },
  { to: "/report", label: "Report" },
  // { to: "/admin",  label: "Admin" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green flex items-center justify-center text-bg font-black text-sm">F</div>
          <span className="font-bold text-white tracking-tight">
            Fraud<span className="text-green">lock</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
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
      </div>
    </nav>
  );
}
