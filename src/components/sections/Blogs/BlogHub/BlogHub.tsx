"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { BlogFilters } from "./BlogFilters";
import { BlogList } from "./BlogList";
import { ALL_FILTER_ID, type BlogHubProps } from "./types";
import styles from "./BlogHub.module.css";
import { Gradient } from "@/components/effects/Gradient";

/**
 * BlogHub
 *
 * Orchestrates the Blog Hub section: the two-tone heading, the
 * filter panel, and the scrollable card list. This is the ONE place
 * that owns filtering state (selectedTopic / selectedReadTime /
 * selectedAudience) and the filtering logic itself — BlogFilters and
 * BlogList are both pure presentation and never touch this state
 * directly, only the values/callbacks passed down to them.
 *
 * Client Component: filtering is interactive (button clicks update
 * state and re-render the list), so this needs "use client" — same
 * reasoning as any other interactive section in the app.
 */
export function BlogHub({ heading, topics, readTimeOptions, audienceOptions, articles }: BlogHubProps) {
  const [selectedTopic, setSelectedTopic] = useState(ALL_FILTER_ID);
  const [selectedReadTime, setSelectedReadTime] = useState(ALL_FILTER_ID);
  const [selectedAudience, setSelectedAudience] = useState(ALL_FILTER_ID);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesTopic = selectedTopic === ALL_FILTER_ID || article.topicId === selectedTopic;
      const matchesReadTime =
        selectedReadTime === ALL_FILTER_ID || article.readTimeId === selectedReadTime;
      const matchesAudience =
        selectedAudience === ALL_FILTER_ID || article.audienceId === selectedAudience;

      return matchesTopic && matchesReadTime && matchesAudience;
    });
  }, [articles, selectedTopic, selectedReadTime, selectedAudience]);

  const [firstWord, ...restWords] = heading.split(" ");
  const rest = restWords.join(" ");

  return (
    <section className={styles.hub}>
   <Gradient
        kind="linear"
        angle="180deg"
        top="65%"
        right="25%"
        size="35rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
  <Gradient

        top="36%"
        left="-20%"
        size="35rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
      <Container>
        <h2 className={styles.title}>
          <span className={styles.highlight}>{firstWord}</span>
          {rest ? ` ${rest}` : ""}
        </h2>

        <BlogFilters
          topics={topics}
          selectedTopic={selectedTopic}
          onTopicChange={setSelectedTopic}
          readTimeOptions={readTimeOptions}
          selectedReadTime={selectedReadTime}
          onReadTimeChange={setSelectedReadTime}
          audienceOptions={audienceOptions}
          selectedAudience={selectedAudience}
          onAudienceChange={setSelectedAudience}
        />

        <div className={styles.listWrapper}>
          <BlogList articles={filteredArticles} />
        </div>
      </Container>
    </section>
  );
}
