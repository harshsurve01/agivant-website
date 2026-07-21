export interface AnnouncementItem {
  id: string;
  text: string;
  href: string;
  cta: string;
}

/**
 * getAnnouncements
 *
 * Returns the ordered list of items that make up the announcement track.
 * Modeled as an array (not a single announcement) because the Figma
 * treats the bar as a repeating track of items, not one fixed message —
 * today's single item is just an array of length 1, so no reshape is
 * needed once a second item (or true marquee looping) is introduced.
 *
 * Same pattern as getNavigation(): mock data for now, swapped for a real
 * Headless WordPress fetch later with no change to the calling component.
 */
export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  return [
    {
      id: "amp-workflows-enterprise",
      text: "Agivant partners with enterprises to bring intelligent workflows to the enterprise.",
      href: "/about",
      cta: "Read more",
    },
  ];
}