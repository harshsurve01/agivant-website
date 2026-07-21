import styles from "./LifecycleStatus.module.css";

interface LifecycleStatusProps {
  label: string;
}

/**
 * LifecycleStatus
 *
 * A small reusable pill for a stage's status (e.g. "Governed"). Kept
 * as its own component rather than inlined in LifecycleItem because
 * it's a generic label pattern — nothing about its markup or styling
 * is specific to the accordion, so it can be reused anywhere else a
 * status pill is needed without dragging accordion concerns with it.
 */
export function LifecycleStatus({ label }: LifecycleStatusProps) {
  return <span className={styles.status}>{label}</span>;
}
