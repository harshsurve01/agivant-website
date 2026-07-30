import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Cube } from "@/components/ui/Icon/Cube";
import { AmpTimeline } from "./AmpTimeline";
import type { AmpProgressData } from "@/data/ampTransformation";
import styles from "./AmpProgress.module.css";

interface AmpProgressProps {
  progress: AmpProgressData;
}

/**
 * AmpProgress
 *
 * Responsible only for the closing "How Amp'd is Your Enterprise?"
 * card: its own heading, the AmpTimeline, and the shared Button — no
 * business logic, no animation. The Button is the existing shared
 * component (see components/ui/Button), never re-implemented here.
 *
 * `progress.button` is optional per "Do NOT assume... the button
 * always exists" — this component renders nothing in its place when
 * a future WordPress response omits it, rather than rendering a
 * broken or empty CTA slot.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function AmpProgress({ progress }: AmpProgressProps) {
  return (
    <div className={styles.progress}>
      <h3 className={styles.title}>{progress.title}</h3>

      <div className={styles.row}>
        <AmpTimeline stages={progress.stages} />

        {progress.button ? (
          <Link href={progress.button.href} className={styles.cta}>
            <Button variant="primary" size="lg" rightIcon={<Cube />}>
              {progress.button.label}
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
