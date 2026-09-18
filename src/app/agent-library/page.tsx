import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgentLibraryPage } from "@/components/sections/AgentLibrary/AgentLibraryPage";

export default function AgentLibraryRoute() {
  return (
    <>
      <Header />
      <AgentLibraryPage />
      <Footer variant="default" />
    </>
  );
}



