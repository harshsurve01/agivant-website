"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
// SVGR pattern matching Hero.tsx — see that file's comment for why
// this is imported as a component rather than a static asset URL.
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import { LifecycleModal } from "./LifecycleModal";
import styles from "./LifecycleSummary.module.css";

interface LifecycleSummaryProps {
  title: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
  details: string[];
}

/**
 * LifecycleSummary
 *
 * Owns the "Amplify" card and its CTA. Per the Figma, the CTA button
 * sits visually below the bordered card, not inside it — that's a
 * layout decision made here (this component's job), not something the
 * parent Lifecycle needs to compose separately.
 *
 * Also owns the "Learn more >" modal interaction for the Amplify stage.
 */
export function LifecycleSummary({
  title,
  description,
  cta,
  details,
}: LifecycleSummaryProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className={styles.summary}>
        <div className={styles.card}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <button
            type="button"
            className={styles.learnMore}
            onClick={() => setIsModalOpen(true)}
          >
            Learn more &gt;
          </button>
        </div>

        <Link href={cta.href}>
          <Button variant="primary" size="lg" rightIcon={<ArrowUpRightIcon />}>
            {cta.label}
          </Button>
        </Link>
      </div>

      <LifecycleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        details={details}
      />
    </>
  );
}
