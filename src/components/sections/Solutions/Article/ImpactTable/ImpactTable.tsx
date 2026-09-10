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

  const {
    heading,
    description,
    closingStatement,
    align = "center",
    highlightPosition,
    highlightCount,
  } = data;
  const isLeftAligned = align === "left";

  const columns =
    data.columns && data.columns.length > 0 ? data.columns : DEFAULT_COLUMNS;

  const ribbonSrc = data.media?.src || RIBBON_ASSET;
  const hasCustomRibbon = Boolean(data.media?.src);

  const renderHeading = () => {
    if (!heading) return null;

    const colonIndex = heading.indexOf(":");
    if (
      colonIndex !== -1 &&
      (highlightPosition === "colon" || !highlightPosition)
    ) {
      const prefix = heading.slice(0, colonIndex + 1);
      const rest = heading.slice(colonIndex + 1);
      return (
        <>
          <span className={styles.highlight}>{prefix}</span>
          <span>{rest}</span>
        </>
      );
    }

    if (highlightPosition === "start") {
      const words = heading.split(" ");
      const count = highlightCount ?? 1;
      const prefix = words.slice(0, count).join(" ");
      const rest = words.slice(count).join(" ");
      return (
        <>
          <span className={styles.highlight}>{prefix}</span>
          {rest ? ` ${rest}` : ""}
        </>
      );
    }

    return heading;
  };

  const renderClosingStatement = () => {
    if (!closingStatement) return null;

    const colonIndex = closingStatement.indexOf(":");
    if (colonIndex !== -1) {
      const prefix = closingStatement.slice(0, colonIndex + 1);
      const rest = closingStatement.slice(colonIndex + 1);
      return (
        <div className={styles.closingStatement}>
          <p className={styles.closingParagraph}>
            <span className={styles.closingHighlight}>{prefix}</span>
            <span>{rest}</span>
          </p>
        </div>
      );
    }

    return (
      <div className={styles.closingStatement}>
        <p className={styles.closingParagraph}>{closingStatement}</p>
      </div>
    );
  };

  return (
    <section className={styles.section} id="impact-table">
      {/* Decorative Background Ribbon Layer */}
      <div
        className={clsx(
          styles.ribbonWrapper,
          hasCustomRibbon && styles.customRibbonWrapper
        )}
        aria-hidden="true"
      >
        <Image
          src={ribbonSrc}
          alt=""
          width={1682}
          height={922}
          className={styles.ribbonImage}
          loading="eager"
        />
      </div>

      <Container
        className={clsx(
          styles.container,
          isLeftAligned && styles.containerLeft
        )}
      >
        {/* Optional Header (renders only if provided in data) */}
        {(heading || description) && (
          <header
            className={clsx(
              styles.header,
              isLeftAligned && styles.headerLeft
            )}
          >
            {heading && (
              <h2
                className={clsx(
                  styles.heading,
                  isLeftAligned && styles.headingLeft
                )}
              >
                {renderHeading()}
              </h2>
            )}
            {description && (
              <p
                className={clsx(
                  styles.description,
                  isLeftAligned && styles.descriptionLeft
                )}
              >
                {description}
              </p>
            )}
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

        {/* Measurable Outcome / Closing Statement */}
        {renderClosingStatement()}
      </Container>
    </section>
  );
}
