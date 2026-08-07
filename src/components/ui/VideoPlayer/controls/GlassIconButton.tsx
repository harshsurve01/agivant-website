import type { ReactNode } from "react";
import styles from "./GlassIconButton.module.css";

interface GlassIconButtonProps {
  icon: ReactNode;
  label: string; // required — becomes aria-label, never decorative-only
  onClick: () => void;
  size?: "large" | "small";
  className?: string;
}

/**
 * GlassIconButton
 *
 * Shared visual + interaction primitive for every circular control in the
 * player (play/pause, mute, fullscreen). Purely presentational — callers
 * own what the click does and what icon is shown.
 */
export function GlassIconButton({
  icon,
  label,
  onClick,
  size = "small",
  className,
}: GlassIconButtonProps) {
  return (
    <button
      type="button"
      className={[styles.button, styles[size], className].filter(Boolean).join(" ")}
      onClick={onClick}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
