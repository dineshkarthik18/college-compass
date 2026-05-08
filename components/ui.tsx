import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold",
        tone === "good" && "bg-skyglass text-ink",
        tone === "warn" && "bg-coral/12 text-coral",
        tone === "neutral" && "bg-white text-ink/70 ring-1 ring-line"
      )}
    >
      {children}
    </span>
  );
}
