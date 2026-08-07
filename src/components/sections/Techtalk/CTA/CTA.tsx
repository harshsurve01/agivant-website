import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import styles from "./CTA.module.css";
import CubeIcon from "@/assets/icons/cube.svg";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";

/**
 * A single CTA action: label + destination. Same "label + href" shape
 * already established by TechTalkHeroProps["cta"] in data/techtalk.ts —
 * kept identical here rather than inventing a parallel shape, so the two
 * can later be factored into one shared `CtaLink` type with no rename.
 */
export interface TechTalkCtaAction {
  /** Button label, rendered exactly as given. */
  label: string;
  /** Destination the button links to. */
  href: string;
}

export interface TechTalkCTAProps {
  /** Centered section heading — the closing "Ready to get..." copy. */
  heading: string;
  /** Right-hand button. Rendered with Button variant="primary". */
  primaryCta: TechTalkCtaAction;
  /** Left-hand button. Rendered with Button variant="dark" (the Figma's "Secondary / Dark"). */
  secondaryCta: TechTalkCtaAction;
}

/**
 * TechTalk — CTA
 *
 * Closing call-to-action section: a centered heading and two buttons,
 * nothing else. Presentation only — no state, hooks, effects, or
 * "use client" — matching Hero and Episodes. All copy and links arrive
 * via props from data/techtalk.ts through page.tsx; this component
 * never imports mock data directly, so it's a no-op swap once a
 * Headless WordPress source replaces the mock data layer.
 *
 * Reuses the shared Button and Container primitives as-is: no new
 * button implementation, no new width-constraint logic. Button has no
 * `href`, so each button is wrapped in a Next.js Link the same way the
 * Hero's single CTA already is — Button stays a plain <button>,
 * navigation is composed at this layer.
 */
export function CTA({ heading, primaryCta, secondaryCta }: TechTalkCTAProps) {
  return (
    <section className={styles.section}>
      <Container size="lg" className={styles.inner}>
        <h2 className={styles.heading}>{heading}</h2>

        <div className={styles.actions}>
          {/*
            Order matches the Figma's left-to-right layout (dark CTA,
            then primary CTA) — same Link-wraps-Button composition
            Hero.tsx already uses: Button has no `href`, so each button
            is wrapped in a Next.js Link here, with Button staying a
            plain <button> and navigation composed at this layer.
          */}
          <Link href={secondaryCta.href}>
            <Button variant="dark" size="lg" rightIcon={<ArrowUpRightIcon />}>
              {secondaryCta.label}
            </Button>
          </Link>
          <Link href={primaryCta.href}>
            <Button variant="primary" size="lg" rightIcon={<CubeIcon />}>
              {primaryCta.label}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}