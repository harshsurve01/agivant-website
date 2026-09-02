import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import type { TestimonialsSectionData } from "@/data/testimonials";
import { TestimonialCarousel } from "./TestimonialCarousel";
import styles from "./Testimonials.module.css";

interface TestimonialsProps {
  data: TestimonialsSectionData;
}

/**
 * Testimonials
 *
 * Server Component representing the Client Testimonials section on the homepage.
 * Renders the prominent section title, continuous interactive infinite carousel,
 * subtle background ribbon artwork, and centered CTA button constrained to the XL container.
 */
export function Testimonials({ data }: TestimonialsProps) {
  return (
    <section className={styles.section} aria-label={data.title}>
      <Container size="xl" className={styles.container}>
        <div className={styles.headingWrap}>
          <h2 className={styles.heading}>{data.title}</h2>
        </div>

        <div className={styles.carouselContainer}>
          <TestimonialCarousel cards={data.cards} />
        </div>

        <div className={styles.ctaWrap}>
          <Link href={data.cta.href} className={styles.ctaLink}>
            <Button variant="primary" size="lg" rightIcon={<ArrowUpRight />}>
              {data.cta.label}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
