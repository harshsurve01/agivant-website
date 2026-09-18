"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/sections/Solutions/Article/Hero";
import agentLibraryData from "@/data/agents.json";
import styles from "./AgentLibraryPage.module.css";

type AgentCategory = {
  id: string;
  label: string;
  icon: string;
};

type AgentGrid = {
  description: string;
  primaryOutcome: string;
  industries: string[];
  primaryDomain: string;
  capabilities: string[];
};

type AgentPopup = {
  whatIDo: string;
  problemsSolved: string[];
  outcomesDelivered: string[];
  targetPersonas: string[];
  industries: string[];
  domains: string[];
  capabilities: string[];
  techStack: string[];
};

type Agent = {
  id: number;
  code: string;
  name: string;
  category: AgentCategory;
  grid: AgentGrid;
  popup: AgentPopup;
};

type AgentLibraryData = {
  hero: {
    title: string;
    summary: string;
    search: {
      placeholder: string;
      buttonLabel: string;
    };
  };
  agentCount: number;
  agents: Agent[];
};

const data = agentLibraryData as AgentLibraryData;

const backgroundImageForAgent = (index: number) => {
  const normalizedIndex = ((index - 1) % 10) + 1;
  return `/images/agents-backgrounds/agent-${normalizedIndex}.png`;
};

export function AgentLibraryPage() {
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All industries");
  const [selectedDomain, setSelectedDomain] = useState("All domains");
  const [selectedCapability, setSelectedCapability] = useState(
    "All capabilities"
  );
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const allIndustries = useMemo(
    () =>
      Array.from(
        new Set(
          data.agents.flatMap((agent) => agent.grid.industries ?? [])
        )
      ).sort(),
    []
  );

  const allDomains = useMemo(
    () =>
      Array.from(
        new Set(
          data.agents.flatMap((agent) =>
            agent.grid.primaryDomain ? [agent.grid.primaryDomain] : []
          )
        )
      ).sort(),
    []
  );

  const allCapabilities = useMemo(
    () =>
      Array.from(
        new Set(
          data.agents.flatMap((agent) => agent.grid.capabilities ?? [])
        )
      ).sort(),
    []
  );

  const filteredAgents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data.agents.filter((agent) => {
      const haystack = [
        agent.name,
        agent.code,
        agent.category.label,
        agent.grid.primaryDomain,
        agent.grid.primaryOutcome,
        ...(agent.grid.industries ?? []),
        ...(agent.grid.capabilities ?? []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || haystack.includes(query);
      const matchesIndustry =
        selectedIndustry === "All industries" ||
        (agent.grid.industries ?? []).includes(selectedIndustry);
      const matchesDomain =
        selectedDomain === "All domains" ||
        agent.grid.primaryDomain === selectedDomain;
      const matchesCapability =
        selectedCapability === "All capabilities" ||
        (agent.grid.capabilities ?? []).includes(selectedCapability);

      return matchesSearch && matchesIndustry && matchesDomain && matchesCapability;
    });
  }, [search, selectedIndustry, selectedDomain, selectedCapability]);

  const totalPages =
    filteredAgents.length === 0 ? 1 : Math.ceil(filteredAgents.length / pageSize);
  const currentPage = Math.min(page, Math.max(0, totalPages - 1));
  const pageStart =
    filteredAgents.length === 0 ? 0 : currentPage * pageSize + 1;
  const pageEnd = Math.min((currentPage + 1) * pageSize, filteredAgents.length);
  const pagedAgents = filteredAgents.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleFilterChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
    setPage(0);
  };

  useEffect(() => {
    if (!selectedAgent) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedAgent]);

  const closeAgentModal = () => setSelectedAgent(null);

  return (
    <GradientLayerProvider>
      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.heroWrapper}>
            <Hero
              heading={data.hero.title}
              description={data.hero.summary}
              media={{
                kind: "image",
                src: "/images/agents-backgrounds/agent-hero-background.png",
                assetKey: "agent-library-hero-ribbon",
                alt: "Agent library ribbon",
                caption: null,
                width: 1800,
                height: 700,
              }}
              className={styles.agentHero}
              ribbonClassName={styles.agentRibbon}
            />
          </section>

          <Container size="2xl" className={styles.contentContainer}>
            <div className={styles.controlBar}>
              <div className={styles.searchRow}>
                <label className={styles.searchField}>
                  <input
                    type="text"
                    aria-label={data.hero.search.placeholder}
                    placeholder={data.hero.search.placeholder}
                    value={search}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    className={styles.searchInput}
                  />
                </label>

                <label className={styles.selectField}>
                  <select
                    value={selectedIndustry}
                    onChange={(event) =>
                      handleFilterChange(setSelectedIndustry, event.target.value)
                    }
                    className={styles.filterSelect}
                  >
                    <option>All industries</option>
                    {allIndustries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.selectField}>
                  <select
                    value={selectedDomain}
                    onChange={(event) =>
                      handleFilterChange(setSelectedDomain, event.target.value)
                    }
                    className={styles.filterSelect}
                  >
                    <option>All domains</option>
                    {allDomains.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.selectField}>
                  <select
                    value={selectedCapability}
                    onChange={(event) =>
                      handleFilterChange(setSelectedCapability, event.target.value)
                    }
                    className={styles.filterSelect}
                  >
                    <option>All capabilities</option>
                    {allCapabilities.map((capability) => (
                      <option key={capability} value={capability}>
                        {capability}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className={styles.gridMeta}>
              <button
                type="button"
                className={styles.paginationButton}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={currentPage === 0}
                aria-label="Previous page"
              >
                &lt;
              </button>
              <span>
                {filteredAgents.length === 0
                  ? "0 of 0"
                  : `${pageStart}-${pageEnd} of ${filteredAgents.length}`}
              </span>
              <button
                type="button"
                className={styles.paginationButton}
                onClick={() =>
                  setPage((current) => Math.min(totalPages - 1, current + 1))
                }
                disabled={currentPage >= totalPages - 1}
                aria-label="Next page"
              >
                &gt;
              </button>
            </div>

            <div className={styles.cardGrid}>
              {pagedAgents.map((agent, index) => {
                const imageSrc =
                  backgroundImageForAgent(currentPage * pageSize + index + 1);

                return (
                  <button
                    key={agent.code}
                    type="button"
                    className={styles.agentCard}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className={styles.visualWrap}>
                      <Image
                        src={imageSrc}
                        alt=""
                        fill
                        className={styles.agentBackground}
                      />
                    </div>

                    <div className={styles.cardBody}>
                      <h2 className={styles.cardTitle}>{agent.name}</h2>
                      <p className={styles.cardDescription}>{agent.grid.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Container>
        </main>

        {selectedAgent && (
          <div className={styles.modalBackdrop} onClick={closeAgentModal}>
            <div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="agent-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className={styles.closeButton}
                onClick={closeAgentModal}
                aria-label="Close agent details"
              >
                ×
              </button>

              <h3 id="agent-modal-title" className={styles.modalTitle}>
                {selectedAgent.name}
              </h3>

              <div className={styles.modalSection}>
                <h4 className={styles.modalSectionTitle}>What I Do</h4>
                <p>{selectedAgent.popup.whatIDo}</p>
              </div>

              <div className={styles.modalSection}>
                <h4 className={styles.modalSectionTitle}>Problems Solved</h4>
                <ul>
                  {selectedAgent.popup.problemsSolved.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.modalSection}>
                <h4 className={styles.modalSectionTitle}>Outcomes Delivered</h4>
                <ul>
                  {selectedAgent.popup.outcomesDelivered.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.modalSection}>
                <h4 className={styles.modalSectionTitle}>Executive Owner</h4>
                <div className={styles.pillRow}>
                  {selectedAgent.popup.targetPersonas.map((persona) => (
                    <span className={styles.pill} key={persona}>
                      {persona}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.modalSection}>
                <h4 className={styles.modalSectionTitle}>Industries</h4>
                <div className={styles.pillRow}>
                  {selectedAgent.popup.industries.map((industry) => (
                    <span className={styles.pill} key={industry}>
                      {industry}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.modalSection}>
                <h4 className={styles.modalSectionTitle}>Domains</h4>
                <div className={styles.pillRow}>
                  {selectedAgent.popup.domains.map((domain) => (
                    <span className={styles.pill} key={domain}>
                      {domain}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.modalSection}>
                <h4 className={styles.modalSectionTitle}>Capabilities</h4>
                <div className={styles.pillRow}>
                  {selectedAgent.popup.capabilities.map((capability) => (
                    <span className={styles.pill} key={capability}>
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.modalSection}>
                <h4 className={styles.modalSectionTitle}>Tech Stack</h4>
                <div className={styles.pillRow}>
                  {selectedAgent.popup.techStack.map((item) => (
                    <span className={styles.pill} key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GradientLayerProvider>
  );
}
