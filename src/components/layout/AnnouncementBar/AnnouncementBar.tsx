import { getAnnouncements, type AnnouncementItem } from "@/data/announcement";
import styles from "./AnnouncementBar.module.css";

/**
 * Minimum number of item-instances we want visible in the track before
 * it starts repeating, so a single short announcement doesn't produce
 * an obviously short loop. Purely a presentation tuning knob.
 */
const MIN_TRACK_ITEMS = 8;

/**
 * buildMarqueeTrack
 *
 * Expands the raw items array into the sequence actually rendered in
 * the track, so the marquee always has enough repeated content to loop
 * seamlessly — regardless of how many items the API returns.
 *
 * Why "repeat count must be even":
 * The CSS keyframes translate the track by exactly -50% (see
 * AnnouncementBar.module.css). That only reads as a seamless loop if
 * the first half of the track and the second half are pixel-identical.
 * The only way to guarantee that generically — without special-casing
 * 1 item vs many — is to make the track a concatenation of N full
 * copies of `items` where N is even: the first N/2 copies are then
 * identical to the last N/2 copies, so translating by -50% lines the
 * track up with itself.
 *
 * We pick N as the smallest even number of copies that gets total
 * rendered instances up to MIN_TRACK_ITEMS (e.g. 1 item -> 8 copies,
 * 3 items -> 4 copies -> 12 instances, 5 items -> 2 copies -> 10
 * instances). Each instance gets a stable, unique key via its copy
 * index, since the same item id can now appear multiple times.
 */
function buildMarqueeTrack(
  items: AnnouncementItem[],
): (AnnouncementItem & { trackKey: string })[] {
  const copiesNeeded = Math.ceil(MIN_TRACK_ITEMS / items.length);
  const evenCopies = copiesNeeded % 2 === 0 ? copiesNeeded : copiesNeeded + 1;

  return Array.from({ length: evenCopies }, (_, copyIndex) =>
    items.map((item) => ({ ...item, trackKey: `${item.id}-${copyIndex}` })),
  ).flat();
}

/**
 * AnnouncementBar
 *
 * A full-width bar rendered above the header, displaying a horizontally
 * repeating track of announcement items. Owns its own background,
 * border, shadow, and spacing — it does not own sticky behavior,
 * scroll-based hiding, or the future marquee animation itself, all of
 * which are the responsibility of whatever composes this into the page
 * shell (e.g. a future <Header> or root layout) or a later GSAP pass.
 *
 * Structure: AnnouncementBar > Viewport > Track > Item(s). Viewport is
 * intentionally NOT inside Container — the marquee should clip at the
 * true edges of the bar (full-bleed), not at Container's inset
 * max-width/padding. Viewport clips overflow and is the hover target
 * for pausing the marquee; Track is what the CSS animation
 * translateX's. See the comments at each layer below for why.
 *
 * Server Component: no "use client", no hooks, no state, no effects.
 * It's async because it awaits its data source directly — the same
 * pattern that will apply once getAnnouncements() is backed by a real
 * Headless WordPress fetch instead of mock data.
 */
export async function AnnouncementBar() {
  const items = await getAnnouncements();

  if (items.length === 0) {
    return null;
  }

  // Presentation-layer only: the API keeps returning exactly the
  // client-provided items; we just decide how many times to render them.
  const trackItems = buildMarqueeTrack(items);

  return (
    <div className={styles.announcementBar}>
      {/* Viewport: clips the track and is the hover target for pausing
          the marquee (see .viewport:hover .track in the CSS module).
          Deliberately full-bleed — not wrapped in Container — so the
          marquee clips at the true edges of the bar, not at Container's
          inset max-width/padding. It never moves itself — only Track
          does. */}
      <div className={styles.viewport}>
        {/* Track: the single element the marquee animation
            translateX's. Every item that should move together as one
            continuous strip lives inside it — nothing outside Track
            needs to change as the animation evolves. */}
        <div className={styles.track}>
          {trackItems.map((item) => (
            <div key={item.trackKey} className={styles.item}>
              <p className={styles.text}>{item.text}</p>
              <a href={item.href} className={styles.cta}>
                {item.cta}
                {/* Arrow is CTA content, not decoration: it moves,
                    truncates, and gets focus/hover treatment together
                    with the label as one unit. Spacing to the label
                    comes from the .cta flex gap, matching how Button
                    spaces its icon + label — never a hardcoded margin. */}
                <svg
                  className={styles.ctaIcon}
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}