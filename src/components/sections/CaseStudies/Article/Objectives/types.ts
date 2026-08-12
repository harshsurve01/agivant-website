/**
 * Props for the Objectives section (two-column: Objectives card +
 * Challenges card).
 *
 * Matches the brief's suggested shape exactly — Figma's "Frame
 * 1707482264" (left card) has only a heading, no body copy, so
 * `title` alone covers it; "Frame 1707482265" (right card) has an
 * eyebrow-style heading plus a bulleted list, covered by
 * `challengesTitle` + `challenges`.
 */
export interface ObjectivesProps {
  /** Left card heading, e.g. "Objectives". */
  title: string;
  /** Right card heading, e.g. "Challenges". */
  challengesTitle: string;
  /** Right card bullet list, in display order. */
  challenges: string[];
}
