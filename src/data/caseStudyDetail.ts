import multiBrandCaseStudyJson from "./case-study-multi-brand.json";
import thirdPartyRiskCaseStudyJson from "./case-study-third-party-ai-risk-management.json";
import spendAnalyticsCaseStudyJson from "./case-study-spend-analytics-vendor-risk-management.json";
import aiTechnicalDocCaseStudyJson from "./case-study-ai-driven-technical-documentation.json";
import npiWorkflowCaseStudyJson from "./case-study-npi-workflow-automation.json";
import securityTestingCaseStudyJson from "./case-study-ai-assisted-security-vulnerability-testing.json";
import agenticSupportOpsCaseStudyJson from "./case-study-agentic-supportops.json";
import autonomousAiOpsCaseStudyJson from "./case-study-autonomous-aiops-self-healing-recovery.json";
import computeFarmCaseStudyJson from "./case-study-million-core-compute-farm-optimization.json";
import salesforceDevCaseStudyJson from "./case-study-gemini-salesforce-developer-productivity.json";
import unifiedDataPlatformCaseStudyJson from "./case-study-unified-data-platform-grounding-layer.json";
import enterpriseMlOpsCaseStudyJson from "./case-study-enterprise-mlops-vertex-ai.json";
import audioQualityCaseStudyJson from "./case-study-ml-audio-quality-monitoring.json";
import autonomousVpsCaseStudyJson from "./case-study-autonomous-vps-image-agent.json";
import digitalFrontDoorCaseStudyJson from "./case-study-agentic-24-7-digital-front-door-it-services.json";
import incidentRecCaseStudyJson from "./case-study-agentic-incident-recommendation.json";
import type { CaseStudyDetailPage } from "@/types/caseStudyDetail";

const multiBrandCaseStudy: CaseStudyDetailPage = multiBrandCaseStudyJson as unknown as CaseStudyDetailPage;
const thirdPartyRiskCaseStudy: CaseStudyDetailPage = thirdPartyRiskCaseStudyJson as unknown as CaseStudyDetailPage;
const spendAnalyticsCaseStudy: CaseStudyDetailPage = spendAnalyticsCaseStudyJson as unknown as CaseStudyDetailPage;
const aiTechnicalDocCaseStudy: CaseStudyDetailPage = aiTechnicalDocCaseStudyJson as unknown as CaseStudyDetailPage;
const npiWorkflowCaseStudy: CaseStudyDetailPage = npiWorkflowCaseStudyJson as unknown as CaseStudyDetailPage;
const securityTestingCaseStudy: CaseStudyDetailPage = securityTestingCaseStudyJson as unknown as CaseStudyDetailPage;
const agenticSupportOpsCaseStudy: CaseStudyDetailPage = agenticSupportOpsCaseStudyJson as unknown as CaseStudyDetailPage;
const autonomousAiOpsCaseStudy: CaseStudyDetailPage = autonomousAiOpsCaseStudyJson as unknown as CaseStudyDetailPage;
const computeFarmCaseStudy: CaseStudyDetailPage = computeFarmCaseStudyJson as unknown as CaseStudyDetailPage;
const salesforceDevCaseStudy: CaseStudyDetailPage = salesforceDevCaseStudyJson as unknown as CaseStudyDetailPage;
const unifiedDataPlatformCaseStudy: CaseStudyDetailPage = unifiedDataPlatformCaseStudyJson as unknown as CaseStudyDetailPage;
const enterpriseMlOpsCaseStudy: CaseStudyDetailPage = enterpriseMlOpsCaseStudyJson as unknown as CaseStudyDetailPage;
const audioQualityCaseStudy: CaseStudyDetailPage = audioQualityCaseStudyJson as unknown as CaseStudyDetailPage;
const autonomousVpsCaseStudy: CaseStudyDetailPage = autonomousVpsCaseStudyJson as unknown as CaseStudyDetailPage;
const digitalFrontDoorCaseStudy: CaseStudyDetailPage = digitalFrontDoorCaseStudyJson as unknown as CaseStudyDetailPage;
const incidentRecCaseStudy: CaseStudyDetailPage = incidentRecCaseStudyJson as unknown as CaseStudyDetailPage;

/**
 * Single source of truth collection of all 16 real individual Case Studies.
 */
export const allCaseStudies: CaseStudyDetailPage[] = [
  multiBrandCaseStudy,
  thirdPartyRiskCaseStudy,
  spendAnalyticsCaseStudy,
  aiTechnicalDocCaseStudy,
  npiWorkflowCaseStudy,
  securityTestingCaseStudy,
  agenticSupportOpsCaseStudy,
  autonomousAiOpsCaseStudy,
  computeFarmCaseStudy,
  salesforceDevCaseStudy,
  unifiedDataPlatformCaseStudy,
  enterpriseMlOpsCaseStudy,
  audioQualityCaseStudy,
  autonomousVpsCaseStudy,
  digitalFrontDoorCaseStudy,
  incidentRecCaseStudy,
];

/**
 * Case Study detail registry by canonical slug.
 */
const CASE_STUDIES_DATA: Record<string, CaseStudyDetailPage> = {
  [multiBrandCaseStudy.slug]: multiBrandCaseStudy,
  [thirdPartyRiskCaseStudy.slug]: thirdPartyRiskCaseStudy,
  [spendAnalyticsCaseStudy.slug]: spendAnalyticsCaseStudy,
  [aiTechnicalDocCaseStudy.slug]: aiTechnicalDocCaseStudy,
  [npiWorkflowCaseStudy.slug]: npiWorkflowCaseStudy,
  [securityTestingCaseStudy.slug]: securityTestingCaseStudy,
  [agenticSupportOpsCaseStudy.slug]: agenticSupportOpsCaseStudy,
  [autonomousAiOpsCaseStudy.slug]: autonomousAiOpsCaseStudy,
  [computeFarmCaseStudy.slug]: computeFarmCaseStudy,
  [salesforceDevCaseStudy.slug]: salesforceDevCaseStudy,
  [unifiedDataPlatformCaseStudy.slug]: unifiedDataPlatformCaseStudy,
  [enterpriseMlOpsCaseStudy.slug]: enterpriseMlOpsCaseStudy,
  [audioQualityCaseStudy.slug]: audioQualityCaseStudy,
  [autonomousVpsCaseStudy.slug]: autonomousVpsCaseStudy,
  [digitalFrontDoorCaseStudy.slug]: digitalFrontDoorCaseStudy,
  [incidentRecCaseStudy.slug]: incidentRecCaseStudy,
};

/**
 * Resolves a Case Study by its canonical slug.
 */
export async function getCaseStudyDetail(
  slug: string
): Promise<CaseStudyDetailPage | null> {
  return CASE_STUDIES_DATA[slug] ?? null;
}

/**
 * Returns all available Case Study canonical slugs for static generation.
 */
export function getAllCaseStudyDetailSlugs(): string[] {
  return Object.keys(CASE_STUDIES_DATA);
}

/**
 * Returns the complete collection of all individual Case Studies.
 */
export function getAllCaseStudies(): CaseStudyDetailPage[] {
  return allCaseStudies;
}
