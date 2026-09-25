import clsx from "clsx";
import type { PartnerAccelerator } from "@/types/partnerDetail";
import styles from "./Solutions.module.css";

export interface SolutionDisplayPanelProps {
  accelerator: PartnerAccelerator;
  pointerLeft: number | null;
  panelRef?: (el: HTMLDivElement | null) => void;
  /** Optional titles for the two columns; defaults to the existing titles. */
  columnLabels?: string[];
  /** Show a vertical divider between the two columns. Defaults to false. */
  columnDivider?: boolean;
  /** Page-specific variant (e.g. "tigergraph"). Defaults to "default". */
  variant?: "default" | "tigergraph";
}

/**
 * SolutionDisplayPanel
 *
 * Displays the dynamic challenge, solution, and multi-agent team breakdown
 * for the currently active accelerator card.
 * Features a dynamic pointer notch that slides to align with the active card.
 */
export function SolutionDisplayPanel({
  accelerator,
  pointerLeft,
  panelRef,
  columnLabels,
  columnDivider = false,
  variant = "default",
}: SolutionDisplayPanelProps) {
  const [firstLabel, secondLabel] =
    columnLabels && columnLabels.length === 2
      ? columnLabels
      : ["The challenge", "The solution"];
  const listItems = accelerator.items ?? [];

  const agents = accelerator.agents || [];
  const hasAgents = agents.length > 0;
  const halfIndex = Math.ceil(agents.length / 2);
  const leftAgents = agents.slice(0, halfIndex);
  const rightAgents = agents.slice(halfIndex);

  return (
    <div
      ref={panelRef}
      className={clsx(
        styles.displayPanel,
        variant === "tigergraph" && styles.tigergraphPanel
      )}
    >
      {/* Dynamic pointer notch */}
      {pointerLeft !== null && (
        <div
          className={styles.pointerNotch}
          style={{ left: `${pointerLeft}px` }}
          aria-hidden="true"
        />
      )}

      {/* Top description for TigerGraph */}
      {variant === "tigergraph" && accelerator.description && (
        <p className={styles.tigergraphPanelDescription}>
          {accelerator.description}
        </p>
      )}

      {/* Top row: The challenge vs The solution */}
      <div
        className={clsx(
          styles.panelTopRow,
          columnDivider && styles.panelTopRowDivided
        )}
      >
        <div className={styles.panelCol}>
          {firstLabel ? (
            <h4 className={styles.panelSectionTitle}>{firstLabel}</h4>
          ) : null}
          {listItems.length > 0 && !accelerator.challenge ? (
            <ul className={styles.panelList}>
              {listItems.map((item) => (
                <li key={item} className={styles.panelText}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.panelText}>{accelerator.challenge}</p>
          )}
        </div>

        <div className={styles.panelCol}>
          {secondLabel ? (
            <h4 className={styles.panelSectionTitle}>{secondLabel}</h4>
          ) : null}
          {listItems.length > 0 && accelerator.challenge ? (
            <ul className={styles.panelList}>
              {listItems.map((item) => (
                <li key={item} className={styles.panelText}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.panelText}>{accelerator.solution}</p>
          )}
        </div>
      </div>

      {/* Bottom highlighted pill statement */}
      {accelerator.highlightStatement && (
        <div className={styles.highlightPill}>
          {accelerator.highlightStatement}
        </div>
      )}

      {/* Bottom section: Meet the agent team (only rendered if agents or agentTeamDescription exist) */}
      {(hasAgents || accelerator.agentTeamDescription) && (
        <>
          <hr className={styles.panelDivider} />
          <div className={styles.panelBottomSection}>
            <h4 className={styles.agentTeamHeading}>
              {accelerator.agentTeamTitle || "Meet the agent team"}
            </h4>

            {accelerator.agentTeamDescription ? (
              <p className={styles.agentTeamSummary}>
                {accelerator.agentTeamDescription}
              </p>
            ) : (
              <div className={styles.agentsGrid}>
                <div className={styles.agentsCol}>
                  {leftAgents.map((agent) => (
                    <p key={agent.name} className={styles.agentItem}>
                      <strong className={styles.agentName}>{agent.name}:</strong>{" "}
                      <span className={styles.agentRole}>{agent.role}</span>
                    </p>
                  ))}
                </div>

                <div className={styles.agentsCol}>
                  {rightAgents.map((agent) => (
                    <p key={agent.name} className={styles.agentItem}>
                      <strong className={styles.agentName}>{agent.name}:</strong>{" "}
                      <span className={styles.agentRole}>{agent.role}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
