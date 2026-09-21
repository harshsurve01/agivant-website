import type { AmpdStepData } from "@/data/services";
import styles from "./HowYourEnterpriseGetsAmpd.module.css";

export interface AmpdStepProps {
  step: AmpdStepData;
}

/**
 * AmpdStep
 *
 * Renders an individual step row with:
 * - Circular number badge on the left (58px, light gray, black text)
 * - Content on the right (purple title + dark description)
 */
export function AmpdStep({ step }: AmpdStepProps) {
  return (
    <li className={styles.step}>
      <div className={styles.circle} aria-hidden="true">
        {step.number}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{step.title}</h3>
        <p className={styles.stepDescription}>{step.description}</p>
      </div>
    </li>
  );
}
