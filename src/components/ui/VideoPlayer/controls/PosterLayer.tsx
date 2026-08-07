import Image from "next/image";
import { LoadingSpinner } from "./LoadingSpinner";
import { PlayIcon } from "./icons";
import glassButtonStyles from "./GlassIconButton.module.css";
import styles from "./PosterLayer.module.css";

interface PosterLayerProps {
  poster: string;
  title: string;
  isLoading: boolean;
  onPlay: () => void;
}

/**
 * PosterLayer
 *
 * The entire pre-interaction surface: poster image, glass play button,
 * and (once clicked) a loading spinner while the engine boots. This is
 * what's rendered instead of the iframe until the user presses play —
 * the structural piece that makes lazy-loading enforceable.
 *
 * The WHOLE poster is the click target, not just the glass circle —
 * the circle is a decorative visual cue, styled by reusing
 * GlassIconButton's CSS classes directly (not the component itself,
 * since nesting a real <button> inside another <button> is invalid
 * HTML and would break the single accessible control this needs to
 * be). One <button> with one aria-label covers the whole surface.
 *
 * STACKING: the spinner/play-button visual is wrapped in `.content`
 * (position: relative; z-index: 2) rather than rendered as a bare
 * flex child. `.poster` (next/image's `fill` prop makes it
 * position: absolute) and `.scrim` (also absolute) both paint AFTER
 * non-positioned content per CSS's stacking rules, regardless of DOM
 * order — without this wrapper, the button/spinner was present and
 * correctly conditioned, just invisible underneath the poster image.
 */
export function PosterLayer({ poster, title, isLoading, onPlay }: PosterLayerProps) {
  return (
    <button
      type="button"
      className={styles.layer}
      onClick={onPlay}
      disabled={isLoading}
      aria-label={isLoading ? `Loading ${title}` : `Play ${title}`}
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="100vw"
        priority={false}
        className={styles.poster}
      />
      <span className={styles.scrim} aria-hidden="true" />

      <span className={styles.content}>
        {isLoading ? (
          <LoadingSpinner label={`Loading ${title}`} />
        ) : (
          <span
            className={[glassButtonStyles.button, glassButtonStyles.large].join(" ")}
            aria-hidden="true"
          >
            <PlayIcon />
          </span>
        )}
      </span>
    </button>
  );
}