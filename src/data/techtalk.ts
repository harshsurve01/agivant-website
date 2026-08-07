import type { TechTalkHeroProps } from "@/components/sections/Techtalk/Hero";
import type {
  Episode,
  EpisodesToolbarContent,
  EpisodePlayerContent,
  EpisodePlaylistContent,
} from "@/components/sections/Techtalk/Episodes/types";
import { ALL_DEPTHS_VALUE } from "@/components/sections/Techtalk/Episodes/types";
import type { TechTalkCTAProps } from "@/components/sections/Techtalk/CTA";

/**
 * TechTalk page content.
 *
 * This file is the data-mapping layer described in the project's
 * WordPress plan: today it's hand-written mock data, but its shape is
 * exactly what a future WordPress JSON response would map onto.
 * page.tsx reads from here and passes each slice straight down as
 * props — Section components never import this file directly, and
 * this file never imports a component's implementation, only its
 * prop types (plus the ALL_DEPTHS_VALUE constant, which lives
 * alongside those types for the same reason).
 *
 * Structured as a single page object (not one export per section) so
 * further sections — episodes' own player/playlist content, cta, etc. —
 * can be added as new keys (or nested under existing ones, like
 * episodes.player alongside episodes.toolbar) without changing how
 * page.tsx consumes this file.
 */
export interface TechTalkData {
  hero: TechTalkHeroProps;
  /** Nested (not flat) so Episode Player/Playlist/Cards content — each
   *  a separate component built in a later pass — can land as sibling
   *  keys here (episodes.player, episodes.playlist, ...) without
   *  reshaping what page.tsx already reads for the toolbar. */
  episodes: {
    toolbar: EpisodesToolbarContent;
    player: EpisodePlayerContent;
    playlist: EpisodePlaylistContent;
    list: Episode[];
  };
  /** Closing call-to-action section. */
  cta: TechTalkCTAProps;
}

export const techTalkData: TechTalkData = {
  hero: {
    heading: "Inside production AI, with the engineers who build it",
    description:
      "Explore the architectures, engineering decisions and technical patterns behind enterprise AI systems. Agivant engineers unpack autonomous agents, graph intelligence and secure APIs through practical TalkTech sessions.",
    cta: {
      label: "Explore TalkTech episodes",
      href: "/techtalk/episodes",
    },
  },
  episodes: {
    toolbar: {
      searchLabel: "Search episodes by topic, tags, or presenter",
      searchPlaceholder: "Search topic, tags or presenter",
      depthLabel: "Subject Depth",
      // Today only "All Levels" exists in the mock data. Add entries
      // here (e.g. { label: "Beginner", value: "beginner" }) to expose
      // future depths — EpisodesToolbar and filterEpisodes both read
      // this list/Episode.depth generically, so no component change
      // is needed to support them.
      depthOptions: [{ label: "All Levels", value: ALL_DEPTHS_VALUE }],
      defaultDepthValue: ALL_DEPTHS_VALUE,
      // Was a frozen literal string ("Showing 3 of 3 episodes").
      // EpisodesToolbar now interpolates {shown}/{total} into this
      // template itself — Episodes.tsx computes the actual numbers
      // from the filtered episode list, so this only needs updating
      // if the *wording* changes, never the counts.
      resultCountTemplate: "Showing {shown} of {total} episodes",
    },
    player: {
      keyTakeawaysLabel: "Key Takeaways & Technical Assets",
      emptyStateLabel:
        "No episodes match your search. Try a different keyword or Subject Depth.",
    },
    playlist: {
      nowStreamingLabel: "Now Streaming",
      speakerLabel: "Speaker:",
    },
    // The first 2 entries are the episodes visible in the supplied
    // Figma, reproduced exactly as before — untouched by this pass.
    // Entries 3–8 are new dummy episodes (clearly fictional
    // speakers/content) added purely to bring the roster to 8, so the
    // playlist's scroll behavior and the toolbar's search/depth
    // filtering both have enough real entries to demonstrate against.
    // Replace/expand this list with the real episode roster once
    // available — nothing about the shape changes when that happens.
    //
    // Every entry carries `depth` and `tags` (see Episodes/types.ts).
    // All 8 use ALL_DEPTHS_VALUE since only "All Levels" exists as a
    // Subject Depth option today (see toolbar.depthOptions above) —
    // swap individual entries to "beginner"/"intermediate"/"advanced"
    // once those options are added, no component change required.
    // `tags` is populated (not left empty) on every entry so search-
    // by-tag is actually exercisable today, not just architecturally
    // ready.
    list: [
      {
        id: "prompt-engineering-ai-business-value",
        // NOTE: this episode's title/category match its playlist card
        // in the Figma exactly. Its description/takeaways are borrowed
        // from the one full paragraph+bullet-list block shown in the
        // player pane, which in the Figma was paired with a different
        // headline ("Engineering sustainable cloud operations with
        // AI"). Since the player and its "Now Streaming" playlist card
        // should describe the same episode, and this was the only
        // complete content block supplied, the two are unified here.
        // Swap in the real description/takeaways for this episode if
        // that pairing wasn't intended.
        title: "Prompt Engineering: Turning AI Into Business Value",
        category: "AI Agents & NLP",
        speaker: {
          name: "Siddhesh Jadye",
          role: "Digital Platform Engineer - AI/ML",
          initials: "SJ",
        },
        description:
          "How Agivant leverages predictive ML models to optimize data center cooling, track digital carbon footprints, and scale green cloud architecture patterns.",
        takeaways: [
          "Predictive server consolidation based on telemetry forecasts",
          "Tracking scopes of carbon emission for multi-cloud deployments",
          "Dynamic workload scheduling optimized for clean-energy peaks",
        ],
        // TODO: no real asset supplied yet — placeholder path, same
        // status as ampd-wordmark.svg/hero-ellipse-stroke.svg elsewhere
        // in this project until the real export lands.
        thumbnail: "/images/techtalk/episodes/image1.jpg",
        youtubeId: "sFzmpcG6RkY",
        duration: "2:17",
        depth: ALL_DEPTHS_VALUE,
        tags: ["prompt engineering", "llm", "ai agents"],
      },
      {
        id: "proactive-fraud-detection-graph-intelligence",
        title: "Proactive Fraud Detection with Graph Intelligence",
        category: "Fraud Detection",
        speaker: {
          name: "Sanjan Rao",
          // TODO: role not shown in the supplied Figma for this speaker.
          role: "TODO — confirm role/title",
          initials: "SR",
        },
        // TODO: no description/takeaways were visible in the Figma for
        // this episode (only its playlist card was shown, not its own
        // player-pane content). Replace with real copy.
        description: "TODO — episode description not yet supplied.",
        takeaways: ["TODO — key takeaways not yet supplied."],
        thumbnail: "/images/techtalk/episodes/image2.jpg",
        youtubeId: "roJW0VTxCIA",
        duration: "TODO",
        depth: ALL_DEPTHS_VALUE,
        tags: ["graph intelligence", "fraud detection", "risk"],
      },
      // -------------------------------------------------------------
      // Entries 3–8 below are dummy content, not sourced from any
      // Figma frame — added to reach 8 total episodes per the brief.
      // -------------------------------------------------------------
      {
        id: "scaling-autonomous-agents-production",
        title: "Scaling Autonomous Agents in Production",
        category: "AI Agents & NLP",
        speaker: {
          name: "Meera Kulkarni",
          role: "Senior AI Engineer",
          initials: "MK",
        },
        description:
          "A look at how Agivant moved multi-step autonomous agents from prototype to production, covering orchestration, tool-calling reliability, and guardrails for long-running agent workflows.",
        takeaways: [
          "Designing retry-safe tool-calling loops for autonomous agents",
          "Guardrail patterns to bound agent action scope in production",
          "Observability techniques for multi-step agent reasoning chains",
        ],
        thumbnail: "/images/techtalk/episodes/image3.png",
        youtubeId: "sFzmpcG6RkY",
        duration: "3:42",
        depth: ALL_DEPTHS_VALUE,
        tags: ["autonomous agents", "orchestration", "ai agents"],
      },
      {
        id: "securing-enterprise-apis-zero-trust",
        title: "Securing Enterprise APIs with a Zero-Trust Architecture",
        category: "Security & APIs",
        speaker: {
          name: "Arjun Mehta",
          role: "Lead Platform Security Engineer",
          initials: "AM",
        },
        description:
          "How Agivant hardens API surfaces for enterprise clients using zero-trust principles — short-lived credentials, per-request authorization, and continuous verification instead of perimeter-only defenses.",
        takeaways: [
          "Replacing long-lived API keys with short-lived, scoped tokens",
          "Enforcing per-request authorization at the service mesh layer",
          "Continuous verification patterns for east-west API traffic",
        ],
        thumbnail: "/images/techtalk/episodes/image1.jpg",
        youtubeId: "roJW0VTxCIA",
        duration: "2:55",
        depth: ALL_DEPTHS_VALUE,
        tags: ["security", "zero trust", "apis"],
      },
      {
        id: "vector-databases-enterprise-search",
        title: "Vector Databases for Enterprise-Grade Search",
        category: "Data & Retrieval",
        speaker: {
          name: "Priya Nair",
          role: "Data Platform Engineer",
          initials: "PN",
        },
        description:
          "Comparing vector database strategies Agivant has evaluated for enterprise semantic search — indexing trade-offs, hybrid keyword+vector retrieval, and keeping recall high at scale.",
        takeaways: [
          "Choosing between HNSW and IVF indexing for large corpora",
          "Blending keyword and vector search for higher recall",
          "Cost/latency trade-offs when scaling retrieval to millions of docs",
        ],
        thumbnail: "/images/techtalk/episodes/image2.jpg",
        youtubeId: "sFzmpcG6RkY",
        duration: "4:10",
        depth: ALL_DEPTHS_VALUE,
        tags: ["vector database", "search", "retrieval"],
      },
      {
        id: "mlops-pipelines-continuous-training",
        title: "MLOps Pipelines for Continuous Model Training",
        category: "MLOps",
        speaker: {
          name: "Rohan Deshpande",
          role: "MLOps Engineer",
          initials: "RD",
        },
        description:
          "Inside Agivant's continuous training pipelines — automated retraining triggers, model versioning, and rollback strategies that keep production models fresh without manual intervention.",
        takeaways: [
          "Data-drift triggers for automated retraining pipelines",
          "Model versioning and safe rollback strategies in production",
          "Canary-testing new model versions before full rollout",
        ],
         thumbnail: "/images/techtalk/episodes/image3.png",
        youtubeId: "sFzmpcG6RkY",
        duration: "3:08",
        depth: ALL_DEPTHS_VALUE,
        tags: ["mlops", "model training", "pipelines"],
      },
      {
        id: "evaluating-llm-quality-enterprise",
        title: "Evaluating LLM Output Quality at Enterprise Scale",
        category: "AI Agents & NLP",
        speaker: {
          name: "Ananya Iyer",
          role: "AI Quality Engineer",
          initials: "AI",
        },
        description:
          "How Agivant builds automated evaluation harnesses for LLM outputs — combining rubric-based scoring, regression suites, and human review sampling to catch quality drift before it reaches customers.",
        takeaways: [
          "Rubric-based automated scoring for open-ended LLM outputs",
          "Regression test suites that catch prompt/model quality drift",
          "Sampling strategies for human-in-the-loop review at scale",
        ],
        thumbnail: "/images/techtalk/episodes/image1.jpg",
        youtubeId: "roJW0VTxCIA",
        duration: "3:29",
        depth: ALL_DEPTHS_VALUE,
        tags: ["llm evaluation", "quality", "nlp"],
      },
      {
        id: "edge-ai-latency-sensitive-inference",
        title: "Edge AI for Latency-Sensitive Inference",
        category: "Infrastructure",
        speaker: {
          name: "Vikram Chatterjee",
          role: "Infrastructure Engineer",
          initials: "VC",
        },
        description:
          "Deploying trimmed-down inference models to edge devices for latency-sensitive enterprise workloads — model quantization, on-device caching, and graceful fallback to cloud inference.",
        takeaways: [
          "Quantization techniques that preserve accuracy on edge hardware",
          "On-device caching to reduce repeated inference round-trips",
          "Graceful fallback patterns from edge to cloud inference",
        ],
        thumbnail: "/images/techtalk/episodes/image2.jpg",
        youtubeId: "sFzmpcG6RkY",
        duration: "2:48",
        depth: ALL_DEPTHS_VALUE,
        tags: ["edge ai", "inference", "infrastructure"],
      },
    ],
  },
  cta: {
    heading: "Ready to get your enterprise Amp'd with Agivant?",
    // TODO: destinations not confirmed against the site's real routes —
    // update once known, same placeholder status as several
    // TODO-tagged hrefs/asset paths above.
    secondaryCta: {
      label: "See client success in action",
      href: "/case-studies",
    },
    primaryCta: {
      label: "How Amp'd delivers real value",
      href: "/amp-d",
    },
  },
};