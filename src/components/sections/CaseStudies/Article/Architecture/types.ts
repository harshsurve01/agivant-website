/**
 * The architecture/Data Sources workflow image.
 */
export interface ArchitectureImage {
  src: string;
  alt: string;
}

/**
 * Image-based Architecture presentation data.
 */
export interface ArchitectureImageData {
  type?: "image";
  image: ArchitectureImage;
  imageWidth?: number;
  imageHeight?: number;
}

/**
 * Interactive iframe-based Architecture presentation data.
 */
export interface ArchitectureEmbedData {
  type: "iframe";
  src: string;
  title?: string;
  minHeight?: string | number;
}

/**
 * Props for the Architecture / Data Sources section.
 * Supports both static diagram images and interactive iframe embeds.
 */
export type ArchitectureProps = ArchitectureImageData | ArchitectureEmbedData;
