/**
 * The architecture/Data Sources workflow image. Mirrors
 * `CaseStudyImage` (src/data/caseStudies.ts) exactly — duplicated
 * here rather than imported, same "data module stays decoupled from
 * UI components" rule every other Article section's types.ts follows
 * (Architecture never imports caseStudies.ts directly; only
 * app/case-studies/[slug]/page.tsx does).
 */
export interface ArchitectureImage {
  src: string;
  alt: string;
}

/**
 * Props for the Architecture / Data Sources section.
 *
 * No `title` field: unlike Outcome/Solution/Technology/Objectives,
 * neither reference screenshot shows a section heading outside the
 * image container — the "Data Sources / Orchestration / Analysis /
 * Visualisation" labels are baked into the diagram asset itself, not
 * separate page copy. Per the brief ("do not invent additional
 * content"), no heading prop is added here.
 */
export interface ArchitectureProps {
  /** The complete Data Sources -> Orchestration -> Analysis ->
   * Visualisation workflow diagram, as a single static image asset —
   * never recreated as HTML/CSS/SVG. */
  image: ArchitectureImage;
  /** Intrinsic width of `image.src`, in pixels. Required by next/image
   * for a non-`fill` image; also used to derive the aspect ratio the
   * image scales by. */
  imageWidth: number;
  /** Intrinsic height of `image.src`, in pixels. See `imageWidth`. */
  imageHeight: number;
}
