export interface LivePromptDemoVideo {
  sourceType?: "youtube" | "asset" | string | null;
  src?: string | null;
  poster?: string | null;
}

export interface LivePromptDemoData {
  heading?: string | null;
  description?: string | null;
  closingStatement?: string | null;
  video?: LivePromptDemoVideo | null;
}

export interface LivePromptDemoProps {
  data: LivePromptDemoData;
}
