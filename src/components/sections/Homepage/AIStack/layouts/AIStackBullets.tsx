import styles from "./AIStackBullets.module.css";

interface AIStackBulletsProps {
  bullets: string[];
}

export function AIStackBullets({ bullets }: AIStackBulletsProps) {
  return (
    <ul className={styles.bullets}>
      {bullets.map((bullet, index) => (
        <li key={index} className={styles.bulletItem}>
          {bullet}
        </li>
      ))}
    </ul>
  );
}
