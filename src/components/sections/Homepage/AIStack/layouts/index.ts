/**
 * layouts/index.ts
 *
 * The ONE place the layout lookup exists. AIStackCard (the server
 * resolver) imports `layouts` and indexes into it with
 * `card.layout` — no if/switch on card.id anywhere in this section.
 *
 * Lives here, not in AIStackCard.tsx itself, so the registry and the
 * five layout components it wires together stay grouped in the same
 * folder — adding a sixth layout later means one new file in this
 * folder plus one new line here, and nothing in AIStackCard.tsx
 * changes.
 */
import type { ComponentType } from "react";
import type { AIStackCardData } from "@/data/ai-stack";
import { AgenticLayout } from "./AgenticLayout";
import { AIMLEngineeringLayout } from "./AIMLEngineeringLayout";
import { CloudPlatformLayout } from "./CloudPlatformLayout";
import { DataEngineeringLayout } from "./DataEngineeringLayout";
import { MLOpsLayout } from "./MLOpsLayout";
import type { AIStackLayoutProps } from "./types";

export type { AIStackLayoutProps } from "./types";

export const layouts: Record<AIStackCardData["layout"], ComponentType<AIStackLayoutProps>> = {
  agentic: AgenticLayout,
  aiml: AIMLEngineeringLayout,
  cloud: CloudPlatformLayout,
  data: DataEngineeringLayout,
  mlops: MLOpsLayout,
};
