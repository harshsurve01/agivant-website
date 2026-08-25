import Image from "next/image";
import { Container } from "@/components/ui/Container";
import styles from "./Architecture.module.css";
import type { ArchitectureProps } from "./types";
import { Gradient } from "@/components/effects/Gradient";
import { ArchitectureEmbed } from "./ArchitectureEmbed";

/**
 * Architecture / Data Sources (Case Study Inner Page)
 *
 * Renders the Architecture section:
 * - If `type === "iframe"`, renders the interactive architecture diagram in the controlled 1250x650.78px viewport.
 * - If `type === "image"`, preserves the static workflow diagram image presentation.
 *
 * Server Component: all content arrives via props.
 */
export function Architecture(props: ArchitectureProps) {
  const isEmbed = "type" in props && props.type === "iframe";

  return (
    <section className={styles.architecture}>
      <Gradient
        kind="linear"
        angle="180deg"
        top="62%"
        left="-25%"
        size="45rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
      <Gradient
        top="70%"
        right="25%"
        size="32rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.28}
        blur="60px"
      />

      <Container className={styles.container}>
        {isEmbed ? (
          <ArchitectureEmbed
            src={props.src}
            title={props.title ?? "Azure Analytics Architecture"}
          />
        ) : (
          <div className={styles.card}>
            <Image
              src={"image" in props ? props.image.src : ""}
              alt={"image" in props ? props.image.alt : ""}
              width={"imageWidth" in props && props.imageWidth ? props.imageWidth : 1003}
              height={"imageHeight" in props && props.imageHeight ? props.imageHeight : 658}
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1050px"
            />
          </div>
        )}
      </Container>
    </section>
  );
}
