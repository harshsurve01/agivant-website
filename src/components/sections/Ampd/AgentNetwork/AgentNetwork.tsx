import clsx from "clsx";
import styles from "./AgentNetwork.module.css";

export interface AgentNetworkNode {
  id: string;
  title: string;
  /** "live" = green dot (default), "pending" = amber dot. */
  status?: "live" | "pending" | string | null;
}

export interface AgentNetworkProps {
  /** Small caption in the top-left corner (e.g. "Agent library · Live network"). */
  label?: string | null;
  /** Central hub card. */
  hub: { eyebrow?: string | null; title: string };
  /** Up to six agents, in slot order: left column top → bottom, then right
   *  column top → bottom. */
  agents: AgentNetworkNode[];
  className?: string;
}

/* Presentation: slot positions (% of the diagram box) and the dashed links.
   Every agent links to the hub; the first two agents of each column are
   also linked to each other (Figma). */
const SLOTS: { x: number; y: number }[] = [
  { x: 20, y: 18 },
  { x: 16.5, y: 52 },
  { x: 26, y: 86 },
  { x: 80, y: 16 },
  { x: 83.5, y: 54 },
  { x: 76, y: 86 },
];
const HUB = { x: 50, y: 50 };
const PEER_LINKS: [number, number][] = [
  [0, 1],
  [3, 4],
];

/**
 * AgentNetwork (Amp'd landing page)
 *
 * Hub-and-spoke diagram: a multi-agent orchestrator card in the centre with
 * agent chips around it, joined by dashed lines. Content comes from props;
 * positions and links are presentation. Below 768px the diagram stacks
 * (hub first, then the agents in a two-column grid) without the lines.
 *
 * Server Component: no client state.
 */
export function AgentNetwork({ label, hub, agents, className }: AgentNetworkProps) {
  const placed = agents.slice(0, SLOTS.length);

  return (
    <div className={clsx(styles.network, className)}>
      {label && (
        <p className={styles.label}>
          <span className={styles.dot} aria-hidden="true" />
          {label}
        </p>
      )}

      <svg
        className={styles.links}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {placed.map((agent, idx) => (
          <line
            key={agent.id}
            x1={HUB.x}
            y1={HUB.y}
            x2={SLOTS[idx].x}
            y2={SLOTS[idx].y}
          />
        ))}
        {PEER_LINKS.filter(([a, b]) => placed[a] && placed[b]).map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            className={styles.peerLink}
            x1={SLOTS[a].x}
            y1={SLOTS[a].y}
            x2={SLOTS[b].x}
            y2={SLOTS[b].y}
          />
        ))}
      </svg>

      <div className={styles.hub} style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}>
        {hub.eyebrow && <span className={styles.hubEyebrow}>{hub.eyebrow}</span>}
        <span className={styles.hubTitle}>{hub.title}</span>
      </div>

      <ul className={styles.agents}>
        {placed.map((agent, idx) => (
          <li
            key={agent.id}
            className={styles.agent}
            style={{ left: `${SLOTS[idx].x}%`, top: `${SLOTS[idx].y}%` }}
          >
            <span
              className={clsx(
                styles.dot,
                agent.status === "pending" && styles.dotPending
              )}
              aria-hidden="true"
            />
            {agent.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
