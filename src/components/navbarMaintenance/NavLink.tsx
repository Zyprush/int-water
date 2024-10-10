import Link from "next/link";
import React from "react";
interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isMinimized: boolean;
  isActive: boolean;
}
export const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  label,
  isMinimized,
  isActive,
}) => (
  <Link
    href={href}
    className={`w-full items-center justify-start flex gap-3 text-xs font-[500] p-3 px-5 hover:bg-primary hover:text-white transition-all duration-300 hover:dark:text-white hover:shadow-inner ${
      isActive ? "bg-secondary text-white" : "text-zinc-400"
    }`}
  >
    <span className={`w-auto ${isMinimized ? "mx-auto" : ""}`}>
      <Icon className={`text-lg ${isActive ? "drop-shadow-lg" : ""}`} />
    </span>
    <p className={`text-sm ${isActive ? "drop-shadow-md" : ""}`}>{label}</p>
  </Link>
);
