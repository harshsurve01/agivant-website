import type { BlogsPageData } from "@/components/sections/Blogs";
import type { ArticlePageData } from "@/components/sections/Blogs/Article";

/**
 * Mock data for the Blogs page, standing in for the future
 * headless-WordPress response. Each slice below matches its
 * section's prop shape exactly (owned by that section, not by this
 * file), so wiring in real WordPress data later is a source swap,
 * not a component change. Nothing here is imported directly by any
 * section component — it only ever flows down through
 * app/blogs/page.tsx → Blogs.tsx → the section itself.
 */

const hero: BlogsPageData["hero"] = {
  heading: "Perspectives\nLessons from production AI",
  description:
    "Practical insights from Agivant engineers building production-grade AI, cloud, data and autonomous agentic workflows.",
  search: {
    placeholder: "Search by keywords, services and tools...",
    buttonLabel: "Search",
  },
};

const featured: BlogsPageData["featured"] = {
  title: "Top Picks for You",
  article: {
    slug: "agentic-ai-transforming-software-engineering-digital-commerce",
    image: "/images/blogs/featured-card.png",
    imageAlt:
      "Abstract render of flowing blue ribbon shapes symbolizing autonomous agent workflows",
    category: "Agentic AI",
    readTime: "6 min read",
    author: "Executive Team",
    title:
      "How Agentic AI Is Transforming Software Engineering in Digital Commerce",
    excerpt:
      "Enterprise-grade autonomous agents are reshaping software architecture and compressing engineering cycles across commerce.",
    publishedDate: "June 2026",
    cta: {
      label: "Read Article",
      href: "/blogs/agentic-ai-transforming-software-engineering-digital-commerce",
    },
  },
};

const hub: BlogsPageData["hub"] = {
  heading: "Blog Hub",
  topics: [
    { id: "all", label: "All blogs" },
    { id: "agentic-ai-agentops", label: "Agentic AI & AgentOps" },
    { id: "ai-ml-engineering", label: "AI & ML Engineering" },
    { id: "cloud-platform-engineering", label: "Cloud & Platform Engineering" },
    { id: "ai-ready-data-engineering", label: "AI-Ready Data Engineering" },
    { id: "mlops-ai-operations", label: "MLOps & AI Operations" },
  ],
  readTimeOptions: [
    { id: "all", label: "All" },
    { id: "quick", label: "Quick (<5m)" },
    { id: "deep", label: "Deep (5m+)" },
  ],
  audienceOptions: [
    { id: "all", label: "All" },
    { id: "executive", label: "Executive" },
    { id: "technical", label: "Technical" },
  ],
  articles: [
    {
      slug: "measuring-productivity-gains-genai-application",
      topicId: "mlops-ai-operations",
      topicLabel: "MLOps & Platforms",
      readTimeId: "quick",
      readTimeLabel: "4 min read",
      audienceId: "technical",
      audienceLabel: "Technical Focus",
      title: "Measuring Productivity Gains of Your GenAI Application (Without Hype)",
      excerpt:
        "A concrete framework for enterprise leaders to audit, track, and prove the ROI of LLM deployments.",
      author: "Dev Analytics Lead",
      publishedDate: "May 26, 2026",
      cta: {
        label: "Read Article",
        href: "/blogs/measuring-productivity-gains-genai-application",
      },
    },
    {
      slug: "create-your-own-enterprise-ai-platform-or-purchase-one",
      topicId: "mlops-ai-operations",
      topicLabel: "MLOps & Platforms",
      readTimeId: "deep",
      readTimeLabel: "8 min read",
      audienceId: "technical",
      audienceLabel: "Technical Focus",
      title: "Create Your Own Enterprise AI Platform or Purchase One?",
      excerpt:
        "A concrete framework for enterprise leaders to audit, track, and prove the ROI of LLM deployments.",
      author: "Dev Analytics Lead",
      publishedDate: "May 28, 2026",
      cta: {
        label: "Read Article",
        href: "/blogs/create-your-own-enterprise-ai-platform-or-purchase-one",
      },
    },
    {
      slug: "ai-application-compliant-from-all-aspects",
      topicId: "mlops-ai-operations",
      topicLabel: "MLOps & Platforms",
      readTimeId: "quick",
      readTimeLabel: "5 min read",
      audienceId: "technical",
      audienceLabel: "Technical Focus",
      title: "Making Sure Your AI Application Is Compliant From All Aspects",
      excerpt:
        "A concrete framework for enterprise leaders to audit, track, and prove the ROI of LLM deployments.",
      author: "Dev Analytics Lead",
      publishedDate: "May 28, 2026",
      cta: {
        label: "Read Article",
        href: "/blogs/ai-application-compliant-from-all-aspects",
      },
    },
    {
      slug: "aiops-pipelines-automating-fault-tolerance-distributed-commerce-grids",
      topicId: "mlops-ai-operations",
      topicLabel: "MLOps & Platforms",
      readTimeId: "quick",
      readTimeLabel: "4 min read",
      audienceId: "technical",
      audienceLabel: "Technical Focus",
      title: "AIOps Pipelines: Automating Fault Tolerance in Distributed Commerce Grids",
      excerpt:
        "A concrete framework for enterprise leaders to audit, track, and prove the ROI of LLM deployments.",
      author: "Dev Analytics Lead",
      publishedDate: "May 26, 2026",
      cta: {
        label: "Read Article",
        href: "/blogs/aiops-pipelines-automating-fault-tolerance-distributed-commerce-grids",
      },
    },
    {
      slug: "agentops-observability-for-multi-agent-systems",
      topicId: "agentic-ai-agentops",
      topicLabel: "Agentic AI & AgentOps",
      readTimeId: "deep",
      readTimeLabel: "7 min read",
      audienceId: "technical",
      audienceLabel: "Technical Focus",
      title: "AgentOps: Building Observability for Multi-Agent Systems",
      excerpt:
        "A concrete framework for enterprise leaders to audit, track, and prove the ROI of LLM deployments.",
      author: "Dev Analytics Lead",
      publishedDate: "May 21, 2026",
      cta: {
        label: "Read Article",
        href: "/blogs/agentops-observability-for-multi-agent-systems",
      },
    },
    {
      slug: "fine-tuning-vs-rag-choosing-the-right-approach",
      topicId: "ai-ml-engineering",
      topicLabel: "AI & ML Engineering",
      readTimeId: "quick",
      readTimeLabel: "5 min read",
      audienceId: "executive",
      audienceLabel: "Executive Focus",
      title: "Fine-Tuning vs. RAG: Choosing the Right Approach for Your Use Case",
      excerpt:
        "A concrete framework for enterprise leaders to audit, track, and prove the ROI of LLM deployments.",
      author: "Dev Analytics Lead",
      publishedDate: "May 19, 2026",
      cta: {
        label: "Read Article",
        href: "/blogs/fine-tuning-vs-rag-choosing-the-right-approach",
      },
    },
    {
      slug: "scaling-kubernetes-for-ai-inference-workloads",
      topicId: "cloud-platform-engineering",
      topicLabel: "Cloud & Platform",
      readTimeId: "deep",
      readTimeLabel: "9 min read",
      audienceId: "technical",
      audienceLabel: "Technical Focus",
      title: "Scaling Kubernetes for High-Throughput AI Inference Workloads",
      excerpt:
        "A concrete framework for enterprise leaders to audit, track, and prove the ROI of LLM deployments.",
      author: "Dev Analytics Lead",
      publishedDate: "May 15, 2026",
      cta: {
        label: "Read Article",
        href: "/blogs/scaling-kubernetes-for-ai-inference-workloads",
      },
    },
    {
      slug: "building-a-governed-data-foundation-for-enterprise-ai",
      topicId: "ai-ready-data-engineering",
      topicLabel: "AI-Ready Data",
      readTimeId: "quick",
      readTimeLabel: "4 min read",
      audienceId: "executive",
      audienceLabel: "Executive Focus",
      title: "Building a Governed Data Foundation for Enterprise AI",
      excerpt:
        "A concrete framework for enterprise leaders to audit, track, and prove the ROI of LLM deployments.",
      author: "Dev Analytics Lead",
      publishedDate: "May 12, 2026",
      cta: {
        label: "Read Article",
        href: "/blogs/building-a-governed-data-foundation-for-enterprise-ai",
      },
    },
  ],
};

export const blogsPageData: BlogsPageData = {
  hero,
  featured,
  hub,
};

/* ============================================================================
   BLOG ARTICLE DATA (Blog Inner / /blogs/[slug])
   ============================================================================
   One entry per article, matched to the Article component's full data
   contract (ArticlePageData: hero, executiveBrief, phase1, phase2, phase3,
   phase4, conclusion) plus the `slug` used to look it up from the dynamic
   route. Same "flat prop-shaped slice per section" pattern as
   `blogsPageData` above — nothing in this array is imported directly by any
   Article section component, it only flows down through
   app/blogs/[slug]/page.tsx → <Article />.

   CONTENT STATUS — please read before editing:
   Only the Conclusion section's copy below is CONFIRMED — it's the exact
   content supplied directly in conversation and already verified against
   the Figma screenshot for this article.

   Every other section's body copy (Hero byline aside, ExecutiveBrief
   paragraphs, Phase1–4 descriptions/emphasis/case-study text) was NOT
   provided in this conversation. The section HEADINGS, eyebrows, card
   titles, and item names below (e.g. "Establishing Baselines", "Time on
   Task", "Diff-in-Diff", "Prompt/tool telemetry", "KPMG Auditing") are real
   — they're already documented in each section component's own doc
   comments from when those sections were built against Figma/screenshots.
   The paragraph-level body copy is marked with a `[PLACEHOLDER — ...]`
   string so it's unmistakable in the rendered page and can't be confused
   for real article content. Swap these for the actual copy before this
   goes live; nothing here should be treated as final.
   ============================================================================ */

export interface BlogArticleData extends ArticlePageData {
  /** Matches the corresponding `hub`/`featured` article's own `slug`, and
   * is what the `/blogs/[slug]` dynamic route looks this entry up by. */
  slug: string;
}

const measuringProductivityGainsArticle: BlogArticleData = {
  slug: "measuring-productivity-gains-genai-application",

  hero: {
    title: "Measuring Productivity Gains of Your GenAI Application (Without Hype)",
    date: "May 26, 2026",
    readTime: "4 mins",
    authors: [{ name: "Dev Analytics Lead", role: "Author" }],
  },

executiveBrief: {
  title: "Executive Brief",
  paragraphs: [
    "As generative AI rapidly transforms the workplace, business leaders are eager to quantify its promise—beyond the headlines and hype. Measuring true productivity gains from GenAI applications requires rigor, not just optimism.",
    "Clear, actionable metrics like key performance indicators (KPIs) are crucial for turning AI’s promise into tangible business results, helping organizations track progress, align with strategic goals, and prove real value from their AI investments. Without these measurable benchmarks, AI adoption risks becoming hype rather than a driver of meaningful productivity.",
  ],
},

phase1: {
  eyebrow: "Phase 1",
  title: "Establishing Baselines",
  description:
    "Before scaling solutions, organizations must map historical reality to evaluate direct operational changes.",
  cards: [
    {
      title: "Time on Task",
      description:
        "This involves measuring the average time workers spend completing tasks before GenAI adoption. Tracking time-on-task post-AI adoption helps show efficiency gains or losses.",
      references: [
        {
          label: "Case Reference",
          text: "The AI @ Morgan Stanley Debrief tool saved financial advisors about 30 minutes per client meeting by automating note-taking and follow-up emails, significantly reducing time-on-task during calls.",
        },
      ],
    },
    {
      title: "Error Rates",
      description:
        "Tracking the frequency and severity of errors in workflows leads to quality improvements. Lower error rates post-AI adoption indicate improvement in accuracy.",
      references: [
        {
          label: "Case Reference",
          text: "Research by the Nielsen Norman Group showed that generative AI tools helped reduce common mistakes in customer support interactions, contributing to a 13.8% increase in queries handled per hour with fewer errors.",
        },
      ],
    },
    {
      title: "Rework Required",
      description:
        "Measure how often completed tasks require additional corrections or revisions due to errors. AI reducing rework means less wasted effort and higher productivity.",
      references: [
        {
          label: "Case Reference A",
          text: "Using GitHub Copilot, a global e-commerce platform doubled productivity and cut rework efforts by 50%, thanks to AI’s real-time code suggestions reducing bugs and revisions.",
        },
        {
          label: "Case Reference B",
          text: "By employing IBM watsonx.ai, the Minijob-Zentrale’s editorial team cut content rewriting and editing time by 75%, using AI to improve initial drafts and minimize rework loops.",
        },
      ],
    },
    {
      title: "Quality-Adjusted Task Minutes",
      description:
        "By blending speed and accuracy into quality-adjusted task minutes, you unveil the true productivity tradeoff, balancing how fast work gets done with the quality delivered. For risky industries like finance or healthcare, this is a critical parameter.",
      references: [
        {
          label: "Case Reference",
          text: "Wellsky’s generative AI integrated assessment tools that automated data entry and reduced administrative errors, improving both throughput and quality-adjusted time spent on patient care.",
        },
      ],
    },
  ],
},

phase2: {
  eyebrow: "Phase 2",
  title: "Running Proper Experiments",
  description:
    "Unlocking credible organizational metrics by filtering visual noise and statistical variance.",
  items: [
    {
      index: "01",
      title: "Difference-in-Differences (Diff-in-Diff)",
      description:
        "Employing difference-in-differences (diff-in-diff) analysis helps to track productivity changes over time between a treatment group (GenAI users) and a control group. This longitudinal method controls for external factors that could affect performance, allowing for more accurate attribution of productivity gains specifically to GenAI adoption. McKinsey highlights diff-in-diff as a robust approach for evaluating the economic impact of AI initiatives.",
    },
    {
      index: "02",
      title: "Power Analysis",
      description:
        "Before running experiments, conducting power analyses is necessary to determine the minimum sample size and data volume required to detect statistically significant effects. This ensures experiments are adequately powered to yield credible conclusions, avoiding false positives or missed signals.",
    },
    {
      index: "03",
      title: "Avoiding Novelty and Selection Bias",
      description:
        "There should be strict control for biases such as novelty effects where initial excitement inflates short-term productivity, and selection bias, where participants self-select into experiments. Proper randomization, blinding when possible, and longitudinal study designs help mitigate these risks, ensuring results reflect lasting, generalizable improvements.",
    },
    {
      index: "04",
      title: "Include Washout Periods",
      description:
        "Incorporating washout periods allow users to acclimate to GenAI tools before measuring productivity gains. This filters out early spikes caused by novelty or learning curves, capturing true sustained improvements over time, a tactic recommended in testing best practices for AI tools.",
    },
    {
      index: "05",
      title: "A/B Testing",
      description:
        "Use A/B testing to compare teams or workflows leveraging GenAI against those using conventional methods. This approach isolates the direct impact of GenAI on productivity by running experiments in real-world conditions with randomly assigned participants. For example, Netflix uses AI-driven A/B testing to tailor thumbnails per user, resulting in up to a 30% increase in engagement and reducing churn by $1 billion annually.",
    },
  ],
},

phase3: {
  eyebrow: "Phase 3",
  title: "End-to-End Instrumentation Strategy",
  description:
    "Integrating high-resolution metric collection across active human-computer loops.",
  cards: [
    {
      primaryTitle: "Prompt/tool telemetry",
   
      primaryDescription:
        "Telemetry captures detailed data about user interactions with GenAI tools in real workflows, including prompts issued, tool responses, when outputs are overridden, and how manual corrections are made.",
      secondaryTitle: "Standard Framework",
      secondaryDescription:
        "OpenTelemetry frameworks are increasingly integrated into GenAI to standardize capturing metrics like token usage, response latency, and prompt complexity, enabling precise performance tracking and troubleshooting.",
    },
    {
      primaryTitle: "Override reasons",
      primaryDescription:
        "This involves collecting feedback on why users override GenAI outputs. It is essential for diagnosing AI limitations, biases, or contextual misunderstandings.",
      secondaryTitle: "User Override Loop",
      secondaryDescription:
        "Understanding override rationale, whether due to wrong facts, tone, irrelevance, or safety concerns guides targeted model improvements. This feedback loop is common in AI-assisted coding tools, where developers explain rejections of suggested code to improve AI suggestions over time.",
    },
    {
      primaryTitle: "User satisfaction",
      primaryDescription:
        "Measuring user and stakeholder satisfaction with Generative AI outputs, workflow efficiency, and perceived quality combines qualitative insights with quantitative metrics to provide a holistic view of AI effectiveness.",
      secondaryTitle: "Enterprise Systems",
      secondaryDescription:
        "Regular surveys, sentiment analysis, and feedback loops help gauge user acceptance, trust, and real-world value. Tools like SentiSum and platforms that integrate AI-powered sentiment analysis across chats, reviews, and social media enable continuous monitoring.",
    },
    {
      primaryTitle: "Business KPIs",
      primaryDescription:
        "Linking GenAI-driven productivity gains to key business KPIs helps quantify AI’s financial and operational impact: lead time reduction, cost-to-serve, throughput, revenue growth, and conversion rates.",
      secondaryTitle: "Value Impact",
      secondaryDescription:
        "Lead time reduction speeds processes. Cost-to-serve measures product delivery expenses. Throughput reflects volume capacity without cost. Revenue growth and conversion rates show sales effectiveness.",
    },
  ],
},

phase4: {
  eyebrow: "Phase 4",
  title: "Reporting in CFO Language",
  description:
    "CFO language bridges the gap between complex financial data and strategic business decision-making. This ensures clear and succinct communication to diverse stakeholders, including board members, investors, and non-finance colleagues, to ensure financial insights are understood and actionable.",
  emphasis:
    "Hence, to effectively communicate the value of GenAI, operational gains should be translated into financial terms that resonate with business leaders. Savings include reductions in contractor hours, operational expenses (OPEX), and cost savings from automating repetitive tasks.",
  caseStudies: [
    {
      title: "CASE STUDY: KPMG AUDITING",
      metricLabel: "Annualized Hours",
      insteadLabel: "Instead of saying:",
      insteadText:
        "“KPMG’s application of generative AI in audit processes led to significant time and cost reductions while ensuring compliance.”",
      sayLabel: "Say:",
      sayText:
        "“KPMG reported that automating audit workflows saved thousands of staff hours annually, equivalent to several million dollars in OPEX.”",
      explanation:
        "By presenting the impact as annualized savings instead of ‘time saved,’ finance leaders saw a direct connection to budget and compliance cost reduction.",
    },
    {
      title: "CASE STUDY: METRO CREDIT UNION",
      metricLabel: "Uplift Metric",
      insteadLabel: "Instead of saying:",
      insteadText:
        "“KPMG’s application of generative AI in audit processes led to significant time and cost reductions while ensuring compliance.”",
      sayLabel: "Say:",
      sayText:
        "“KPMG reported that automating audit workflows saved thousands of staff hours annually, equivalent to several million dollars in OPEX.”",
      explanation:
        "By presenting the impact as annualized savings instead of ‘time saved,’ finance leaders saw a direct connection to budget and compliance cost reduction.",
    },
    {
      title: "CASE STUDY: CONTINGENCY & MITIGATION",
      metricLabel: "Risk Avoidance",
      insteadLabel: "Instead of saying:",
      insteadText:
        "“KPMG’s application of generative AI in audit processes led to significant time and cost reductions while ensuring compliance.”",
      sayLabel: "Say:",
      sayText:
        "“KPMG reported that automating audit workflows saved thousands of staff hours annually, equivalent to several million dollars in OPEX.”",
      explanation:
        "By presenting the impact as annualized savings instead of ‘time saved,’ finance leaders saw a direct connection to budget and compliance cost reduction.",
    },
  ],
},

  // CONFIRMED — exact content supplied directly in conversation, already
  // verified against the Figma screenshot for this article.
  conclusion: {
    title: "Conclusion",
    paragraphs: [
      "Measuring productivity gains from generative AI isn't about proving that the technology is exciting: it's about proving that it delivers measurable, sustainable business value. By starting with clear baselines, running well-designed experiments, instrumenting workflows end to end, and finally reporting results in CFO language, organizations can move beyond hype and ground their AI strategies in financial reality.",
      "The companies that succeed with GenAI won't be the ones boasting the most pilots or demos; they'll be the ones who can show, with rigor and credibility, how AI improves efficiency, uplifts revenue, and reduces risk, expressed in terms that matter at the boardroom table.",
    ],
    quote:
      "In short: a company should measure carefully, report transparently, and always connect GenAI's promise to the P&L. That is how lasting buy-in is secured and AI adoption is turned into a true driver of competitive advantage.",
  },
};

/**
 * All Blog Inner articles. Currently a single entry — the article whose
 * Conclusion copy was confirmed in conversation — added here rather than
 * fabricating entries for the other seven `hub.articles` slugs, which have
 * no Article-page content at all yet. `getArticleBySlug` naturally returns
 * `undefined` for those, and the dynamic route calls `notFound()` in that
 * case, same as it would for a genuinely nonexistent slug.
 */
export const blogArticles: BlogArticleData[] = [measuringProductivityGainsArticle];

/**
 * Looks up one Blog Inner article by its slug. Returns `undefined` when no
 * article matches — callers (the `/blogs/[slug]` route) are expected to
 * call Next's `notFound()` in that case rather than rendering a partial
 * page. Kept here alongside the data it queries, same reasoning
 * `ALL_FILTER_ID` lives beside `BlogHubProps` in BlogHub/types.ts — a
 * small piece of logic that only makes sense next to the shape it
 * operates on.
 */
export function getArticleBySlug(slug: string): BlogArticleData | undefined {
  return blogArticles.find((article) => article.slug === slug);
}