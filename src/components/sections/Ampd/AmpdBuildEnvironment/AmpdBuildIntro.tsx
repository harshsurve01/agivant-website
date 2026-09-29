import clsx from "clsx";
import type { AmpdBuildIntroProps } from "./types";
import styles from "./AmpdBuildEnvironment.module.css";

/**
 * AmpdBuildIntro — the intro block at the top of an Amp'd build-environment
 * panel: purple eyebrow, short rule, heading and body, in one of four
 * arrangements (see `layout`). Optional role pills (`tags`) and a CTA (`action`) sit under the body.
 */
export function AmpdBuildIntro({
  eyebrow,
  heading,
  body,
  layout = "stacked",
  tags = [],
  action,
  aside,
}: AmpdBuildIntroProps) {
  const head = (
    <div className={styles.introHead}>
      {eyebrow && <p className={styles.introEyebrow}>{eyebrow}</p>}
      <span className={styles.introRule} aria-hidden="true" />
      {heading && <h3 className={styles.introHeading}>{heading}</h3>}
    </div>
  );
  const text = body ? <p className={styles.introBody}>{body}</p> : null;
  const extras = (
    <>
      {tags.length > 0 && (
        <ul className={styles.pills}>
          {tags.map((tag) => (
            <li key={tag} className={styles.pill}>
              {tag}
            </li>
          ))}
        </ul>
      )}
      {action && <div className={styles.cta}>{action}</div>}
    </>
  );

  if (layout === "split") {
    return (
      <div className={clsx(styles.intro, styles.introSplit)}>
        {head}
        <div className={styles.introCopy}>
          {text}
          {extras}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        styles.intro,
        layout === "offset" && styles.introOffset,
        layout === "media" && styles.introMedia
      )}
    >
      <div className={styles.introCopy}>
        {head}
        {text}
        {extras}
      </div>
      {layout === "media" && aside && (
        <div className={styles.introAside}>{aside}</div>
      )}
    </div>
  );
}
