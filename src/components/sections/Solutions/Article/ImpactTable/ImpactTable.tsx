import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import type { ImpactTableProps } from "./types";
import styles from "./ImpactTable.module.css";

const DEFAULT_COLUMNS = ["Signal", "Mechanism", "Agivant impact"];
const RIBBON_ASSET =
  "/images/solutions/innerpages/goal-driven-agents-enterprise-workflows/hero-ribbon.png";

/**
 * ImpactTable (Solution Inner Page: /solutions/[slug])
 *
 * Section ID: "impact-table"
 * - Decorative low-opacity background ribbon (table-ribbon.png).
 * - Translucent blurred table surface with subtle borders & soft elevation.
 * - Purple header row with white centered text (Signal, Mechanism, Agivant impact).
 * - 4 body rows with subtle row/column dividers:
 *   - Column 1 (Signal): Poppins SemiBold 18px / 25px line height.
 *   - Column 2 (Mechanism): Poppins Regular 18px / 25px line height.
 *   - Column 3 (Agivant impact): Poppins Regular 18px / 25px line height.
 * - Responsive table container for smooth touch scrolling on mobile viewports.
 *
 * Server Component: all data arrives via typed props from solutionPage.json.
 */
export function ImpactTable({ data, blocks }: ImpactTableProps) {
  if (!data || !blocks?.length) return null;

  const { heading, description } = data;
  const columns =
    data.columns && data.columns.length > 0 ? data.columns : DEFAULT_COLUMNS;

  return (
    <section className={styles.section} id="impact-table">
      {/* Decorative Background Ribbon Layer */}
      <div className={styles.ribbonWrapper} aria-hidden="true">
        <Image
          src={RIBBON_ASSET}
          alt=""
          width={1440}
          height={500}
          className={styles.ribbonImage}
        />
      </div>

      <Container className={styles.container}>
        {/* Optional Header (renders only if provided in data) */}
        {(heading || description) && (
          <header className={styles.header}>
            {heading && <h2 className={styles.heading}>{heading}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </header>
        )}

        {/* 3-Column Comparison Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.headerRow}>
                {columns.map((col, idx) => (
                  <th key={idx} scope="col" className={styles.th}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => {
                const cells = block.cells ?? [];
                return (
                  <tr key={block.id} className={styles.tr}>
                    {cells.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className={clsx(
                          styles.td,
                          cellIdx === 0 && styles.signalCell
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
