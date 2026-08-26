import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageRibbon } from "@/components/ui/PageRibbon";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { PartnerHero } from "@/components/sections/Partners/Detail/PartnerHero";
import { PartnerIntro } from "@/components/sections/Partners/Detail/PartnerIntro";
import { AgenticEnterprise } from "@/components/sections/Partners/Detail/AgenticEnterprise";
import { Solutions } from "@/components/sections/Partners/Detail/Solutions";
import { ProductionProof } from "@/components/sections/Partners/Detail/ProductionProof";
import { BuiltOnGemini } from "@/components/sections/Partners/Detail/BuiltOnGemini";
import { getPartnerDetail, getAllPartnerSlugs } from "@/data/partners";
import styles from "./PartnerDetailPage.module.css";
import { Gradient } from "@/components/effects/Gradient";

interface PartnerDetailPageProps {
  params: Promise<{ partner: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPartnerSlugs();
  return slugs.map((slug) => ({ partner: slug }));
}

export async function generateMetadata({
  params,
}: PartnerDetailPageProps): Promise<Metadata> {
  const { partner: slug } = await params;
  const partner = await getPartnerDetail(slug);

  if (!partner) {
    return { title: "Partner Not Found | Agivant" };
  }

  return {
    title: partner.meta.title,
    description: partner.meta.description,
  };
}

export default async function PartnerDetailPage({
  params,
}: PartnerDetailPageProps) {
  const { partner: slug } = await params;
  const partner = await getPartnerDetail(slug);

  if (!partner) {
    notFound();
  }

  return (
    <GradientLayerProvider>
      <div className={styles.page}>
        <Header />

        {partner.hero.ribbonSrc && (
          <PageRibbon
            src={partner.hero.ribbonSrc}
            width={1440}
            height={696}
            className={styles.ribbonWrapper}
            imageClassName={styles.ribbonImage}
            priority
          />
        )}
      <Gradient
        top="85%"
        left="-5%"
        size="20rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
      <Gradient
        top="50%"
        left="-5%"
        size="30rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.6}
        blur="60px"
      />
         <Gradient
              top="35%"
              right="25%"
              size="45rem"
              stops={["#8500df 50%", "#edbf79 55%", "transparent 75%"]}
              opacity={0.1}
              blur="80px"
            />
         <Gradient
        kind="linear"
        angle="180deg"
        top="82%"
        right="25%"
        size="35rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
         <Gradient
        kind="linear"
        angle="180deg"
        top="15%"
        right="25%"
        size="35rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
      <Gradient
        top="75%"
        right="25%"
        size="20rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
      <Gradient
        top="23%"
        right="25%"
        size="40rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
         <Gradient
        kind="linear"
        angle="180deg"
        top="72%"
        left="-25%"
        size="35rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
        <main id="main-content">
          <PartnerHero hero={partner.hero} />
          {partner.intro && <PartnerIntro intro={partner.intro} />}
          {partner.agenticEnterprise && (
            <AgenticEnterprise data={partner.agenticEnterprise} />
          )}
          {partner.solutions && <Solutions data={partner.solutions} />}
          {partner.productionProof && (
            <ProductionProof data={partner.productionProof} />
          )}
          {partner.builtOnGemini && (
            <BuiltOnGemini data={partner.builtOnGemini} />
          )}
        </main>

        <Footer
          variant="partner-detail"
          ctaData={
            partner.cta
              ? {
                  heading: partner.cta.heading,
                  description: partner.cta.description,
                  buttons: [
                    {
                      label: partner.cta.buttonLabel,
                      href: partner.cta.buttonHref,
                      variant: "primary",
                      icon: partner.cta.buttonIcon ?? "cube",
                    },
                  ],
                }
              : undefined
          }
        />
      </div>
    </GradientLayerProvider>
  );
}
