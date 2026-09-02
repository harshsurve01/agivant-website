import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import type { LivePromptDemoProps } from "./types";
import styles from "./LivePromptDemo.module.css";

/**
 * LivePromptDemo (Solution Inner Page Section)
 *
 * Renders the "Watch an agent get real-time prompts mid-call" video demo section:
 * - Section heading (4xl semibold purple)
 * - Section description (18px regular black)
 * - Large centered video player (890x500.62 aspect ratio) reusing shared VideoPlayer
 * - Graceful placeholder state when video source is not yet provided
 * - Closing statement below video (purple)
 */
export function LivePromptDemo({ data }: LivePromptDemoProps) {
  const { heading, description, closingStatement, video } = data;

  const hasVideoSource = Boolean(video?.src && video.src.trim().length > 0);

  return (
    <section className={styles.section}>
      <Container className={styles.container}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.playerWrapper}>
          {hasVideoSource && video?.src ? (
            <VideoPlayer
              source={{
                provider: (video.sourceType === "youtube" ? "youtube" : "youtube") as "youtube",
                id: video.src,
              }}
              poster={video?.poster || "/images/solutions/thumbnail.png"}
              title={heading || "Live Agent Prompt Video"}
              className={styles.player}
            />
          ) : (
            <div className={styles.placeholderCard}>
              <Image
                src="/images/logo.svg"
                alt="Agivant"
                width={180}
                height={48}
                className={styles.placeholderLogo}
              />
              <div className={styles.playButtonOverlay} aria-label="Play video">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {closingStatement && (
          <p className={styles.closingStatement}>{closingStatement}</p>
        )}
      </Container>
    </section>
  );
}
