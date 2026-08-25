import type { PartnerAccelerator } from "@/types/partnerDetail";
import styles from "./Solutions.module.css";

export interface SolutionDisplayPanelProps {
  accelerator: PartnerAccelerator;
  pointerLeft: number | null;
  panelRef?: (el: HTMLDivElement | null) => void;
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
}: SolutionDisplayPanelProps) {
  const halfIndex = Math.ceil(accelerator.agents.length / 2);
  const leftAgents = accelerator.agents.slice(0, halfIndex);
  const rightAgents = accelerator.agents.slice(halfIndex);

  return (
    <div ref={panelRef} className={styles.displayPanel}>
      {/* Dynamic pointer notch */}
      {pointerLeft !== null && (
        <div
          className={styles.pointerNotch}
          style={{ left: `${pointerLeft}px` }}
          aria-hidden="true"
        />
      )}

      {/* Top row: The challenge vs The solution */}
      <div className={styles.panelTopRow}>
        <div className={styles.panelCol}>
          <h4 className={styles.panelSectionTitle}>The challenge</h4>
          <p className={styles.panelText}>{accelerator.challenge}</p>
        </div>

        <div className={styles.panelCol}>
          <h4 className={styles.panelSectionTitle}>The solution</h4>
          <p className={styles.panelText}>{accelerator.solution}</p>
        </div>
      </div>

      {/* Divider */}
      <hr className={styles.panelDivider} />

      {/* Bottom section: Meet the agent team */}
      <div className={styles.panelBottomSection}>
        <h4 className={styles.agentTeamHeading}>
          {accelerator.agentTeamTitle || "Meet the agent team"}
        </h4>

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
      </div>
    </div>
  );
}
