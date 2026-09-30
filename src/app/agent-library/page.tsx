import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgentLibraryPage } from "@/components/sections/AgentLibrary/AgentLibraryPage";
import styles from "./AgentsLibraryPage.module.css";

export default function AgentLibraryRoute() {
  return (
    // Same page wrapper as the other routes: `overflow-x: clip` keeps any
    // wide decorative element from causing sideways page scrolling.
    <div className={styles.page}>
      <Header />
      <AgentLibraryPage />
      <Footer variant="default" />
    </div>
  );
}
