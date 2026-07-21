export interface TrustCardData {
  id: string;
  title: string;
  description: string;
  badge: string;
  accentColor: string;
}

/**
 * getTrustCards
 *
 * Returns the ordered set of cards in the Trust stack. Only the first
 * card ("Global Enterprise Trust") appears in the current Figma frame —
 * accentColor for cards 2 and 3 is a placeholder pending confirmation,
 * same convention as the TODO(figma) comments elsewhere in this codebase.
 *
 * Same pattern as getNavigation()/getAnnouncements(): mock data for now,
 * swapped for a real Headless WordPress fetch later with no change to
 * the calling components.
 */
export async function getTrustCards(): Promise<TrustCardData[]> {
  return [
    {
      id: "global-enterprise-trust",
      title: "Global Enterprise Trust",
      description:
        "Agivant is trusted for complex, high-scale engineering by global enterprises",
      badge: "Trusted",
      accentColor: "#7C3AED", // confirmed via Figma: card 1 badge/title color
    },
    {
      id: "ai-native-since-day-1",
      title: "AI-Native since Day 1",
      description:
        "Agivant was built AI-native, with engineers and agents working as one",
      badge: "Amplified",
      accentColor: "#2563EB", // TODO(figma): card 2 not yet shown in Figma — placeholder
    },
    {
      id: "hyperscaler-partner-ecosystem",
      title: "Hyperscaler and Partner Ecosystem",
      description:
        "Agivant works across global hyperscaler, data, AI and workflow platforms enterprises depend on",
      badge: "Connected",
      accentColor: "#0D9488", // TODO(figma): card 3 not yet shown in Figma — placeholder
    },
  ];
}