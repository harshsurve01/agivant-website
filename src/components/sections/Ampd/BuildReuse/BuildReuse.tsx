import Link from "next/link";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Cube } from "@/components/ui/Icon/Cube";
import styles from "./BuildReuse.module.css";

export interface BuildReuseRow {
  id: string;
  /** Row label, e.g. "Build 01". */
  title: string;
  /** Number of filled (reused-asset) cells. */
  reused: number;
  /** Total cells in the row. */
  total: number;
}

export interface BuildReuseProps {
  /** Large lead statement (left). */
  heading?: string | null;
  /** Supporting paragraph (left). */
  body?: string | null;
  /** Primary CTA (left). */
  cta?: { label: string; href: string } | null;
  /** Progress rows (right panel). */
  rows: BuildReuseRow[];
  /** Legend labels: [reused, new work]. */
  legend?: [string, string] | null;
  className?: string;
}

/**
 * BuildReuse (Amp'd landing page — "Every build amplifies the next")
 *
 * Left: lead statement, paragraph and CTA. Right: a glass panel with one row
 * per build, each a strip of cells where filled cells are reused assets and
 * outlined cells are new work, plus a legend.
 *
 * Server Component: presentation only.
 */
export function BuildReuse({
  heading,
  body,
  cta,
  rows,
  legend,
  className,
}: BuildReuseProps) {
  return (
    <div className={clsx(styles.layout, className)}>
      <div className={styles.copy}>
        {heading && <p className={styles.heading}>{heading}</p>}
        {body && <p className={styles.body}>{body}</p>}
        {cta && (
          <Link href={cta.href} className={styles.cta}>
            <Button variant="primary" size="lg" rightIcon={<Cube />}>
              {cta.label}
            </Button>
          </Link>
        )}
      </div>

      <div className={styles.panel}>
        <ul className={styles.rows}>
          {rows.map((row) => (
            <li key={row.id} className={styles.row}>
              <span className={styles.rowLabel}>{row.title}</span>
              <span
                className={styles.cells}
                role="img"
                aria-label={`${row.title}: ${row.reused} of ${row.total} reused`}
              >
                {Array.from({ length: row.total }, (_, idx) => (
                  <span
                    key={idx}
                    className={clsx(
                      styles.cell,
                      idx < row.reused && styles.cellFilled
                    )}
                  />
                ))}
              </span>
            </li>
          ))}
        </ul>

        {legend && (
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={clsx(styles.legendSwatch, styles.cellFilled)} />
              {legend[0]}
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendSwatch} />
              {legend[1]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
