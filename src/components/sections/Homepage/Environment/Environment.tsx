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
import { Gradient } from "@/components/effects/Gradient";
import styles from "./Environment.module.css";

/**
 * Environment
 *
 * The "What's Inside The Amp'd Build Environment?" section. Owns
 * section-level background/spacing and data loading only — layout of
 * the header/timeline/card/CTA stack now lives inside
 * EnvironmentExperience (see that file's doc comment). This
 * component's job is: render the section's background glow, fetch
 * the three data sources, then compose them into
 * EnvironmentExperience.
 *
 * GRADIENT: same <Gradient/> pattern as AIStack.tsx — portaled into
 * the shared page-wide GradientLayer rather than clipped to this
 * section's own box, so it can bleed into neighboring sections the
 * same way the page's other glows do. `.environment` keeps
 * `position: relative` (see Environment.module.css) purely so
 * <Gradient/>'s invisible marker has this section as its positioned
 * ancestor for its `top`/`right` offsets, same reasoning as AIStack's
 * own comment on this.
 *
 * WHY EnvironmentHeader AND THE CTA ARE INSTANTIATED HERE, NOT INSIDE
 * EnvironmentExperience:
 * EnvironmentExperience is a Client Component ("use client") because
 * it owns the auto-advance timer that drives the active stage. A
 * Client Component file cannot *import* a Server Component and render
 * it as its own JSX — doing so would pull that component into the
 * client bundle the moment it's imported, silently turning it into a
 * client component in practice even without its own "use client"
 * directive. That would quietly violate "EnvironmentHeader should
 * remain a Server Component."
 *
 * The correct boundary-crossing pattern is composition via props:
 * this Server Component renders <EnvironmentHeader /> and the CTA's
 * <Link>/<Button /> itself, then passes the *already-rendered* result
 * into EnvironmentExperience as the `header`/`cta` props (typed
 * ReactNode). React treats that JSX as an opaque, pre-rendered slot —
 * EnvironmentExperience places it inside its layout without ever
 * importing or re-rendering it on the client. Same reasoning as the
 * standard "children as a slot across the server/client boundary"
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
      <Gradient
        kind="linear"
        angle="90deg"
        top="45%"
        right="24%"
        size="35rem"
        stops={["#edbf79 55%", "transparent 75%"]}
        opacity={0.25}
        blur="90px"
      />
      <Gradient
        top="-18%"
        left="-25%"
        size="45rem"
        stops={["#8500df 50%", "#edbf79 55%", "transparent 75%"]}
        opacity={0.01}
        blur="80px"
      />

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