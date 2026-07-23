import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Cube } from "@/components/ui/Icon/Cube";
import { EnvironmentHeader } from "./EnvironmentHeader";
import { EnvironmentExperience } from "./EnvironmentExperience";
import {
  getEnvironmentHeader,
  getEnvironmentStages,
  getEnvironmentCTA,
} from "@/data/environment";
import styles from "./Environment.module.css";

/**
 * Environment
 *
 * The "What's Inside The Amp'd Build Environment?" section. Owns
 * section-level background/spacing and data loading only — layout of
 * the header/timeline/card/CTA stack, and the pin + scroll-sync that
 * ties them together, now all live inside EnvironmentExperience (see
 * that file's doc comment). This component's job has shrunk to:
 * fetch the three data sources, then compose them into
 * EnvironmentExperience.
 *
 * WHY EnvironmentHeader AND THE CTA ARE INSTANTIATED HERE, NOT INSIDE
 * EnvironmentExperience:
 * EnvironmentExperience is a Client Component ("use client") because
 * it owns the scroll listener that drives the pin/sync. A Client
 * Component file cannot *import* a Server Component and render it as
 * its own JSX — doing so would pull that component into the client
 * bundle the moment it's imported, silently turning it into a client
 * component in practice even without its own "use client" directive.
 * That would quietly violate "EnvironmentHeader should remain a
 * Server Component."
 *
 * The correct boundary-crossing pattern is composition via props:
 * this Server Component renders <EnvironmentHeader /> and the CTA's
 * <Link>/<Button /> itself, then passes the *already-rendered* result
 * into EnvironmentExperience as the `header`/`cta` props (typed
 * ReactNode). React treats that JSX as an opaque, pre-rendered slot —
 * EnvironmentExperience places it inside the pinned layout without
 * ever importing or re-rendering it on the client. Same reasoning as
 * the standard "children as a slot across the server/client boundary"
 * pattern in the App Router.
 *
 * The CTA has no dedicated component (it's just Link + Button, same
 * as before this refactor) — it doesn't need one, since it's static
 * content with no shape worth naming beyond `EnvironmentCTAData`.
 *
 * Server Component: no "use client", no hooks, no state, no effects.
 */
export async function Environment() {
  const [header, stages, cta] = await Promise.all([
    getEnvironmentHeader(),
    getEnvironmentStages(),
    getEnvironmentCTA(),
  ]);

  return (
    <section className={styles.environment}>
      <Container>
        <EnvironmentExperience
          header={
            <EnvironmentHeader heading={header.heading} description={header.description} />
          }
          stages={stages}
          cta={
            <Link href={cta.href}>
              <Button variant="primary" size="lg" rightIcon={<Cube />}>
                {cta.label}
              </Button>
            </Link>
          }
        />
      </Container>
    </section>
  );
}