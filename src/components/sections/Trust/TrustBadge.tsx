import styles from "./TrustBadge.module.css";

interface TrustBadgeProps {
  label: string;
}

/**
 * TrustBadge
 *
 * A small reusable pill for a single word/short phrase (e.g. "Trusted",
 * "Amplified", "Connected"). Deliberately takes only `label` — no color
 * prop — so it stays reusable outside Trust; its color instead reads
 * the `--trust-accent` custom property from whichever ancestor sets it
 * (TrustCard today), falling back to the default text color otherwise.
 */
export function TrustBadge({ label }: TrustBadgeProps) {
  return <span className={styles.badge}>{label}</span>;
}