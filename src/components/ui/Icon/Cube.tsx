import type { SVGProps } from "react";
import CubeSvg from "@/assets/icons/cube.svg";

/**
 * Cube
 *
 * Part of the shared icon system (components/ui/icons/). Wraps the
 * existing cube.svg asset — the same file AIStack.tsx already imports
 * directly via SVGR — rather than defining new artwork. The point of
 * this file isn't a new icon, it's one shared import path: sections
 * consume `Cube` from here instead of each importing
 * "@/assets/icons/cube.svg" locally, so there's a single place to
 * update or animate later instead of one per section.
 */
export function Cube(props: SVGProps<SVGSVGElement>) {
  return <CubeSvg {...props} />;
}
