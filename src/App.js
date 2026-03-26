import "./App.css";
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { usePortfolioContent } from "./hooks/usePortfolioContent";

function App() {
  const { content, isLoading, source, error } = usePortfolioContent();

  return (
    <div className="app-shell">
      <div className="app-glow app-glow-left" aria-hidden="true" />
      <div className="app-glow app-glow-right" aria-hidden="true" />

      <NavBar site={content.site} socialLinks={content.socialLinks} />

      <main>
        <Banner
          hero={content.hero}
          site={content.site}
          stats={content.stats}
          socialLinks={content.socialLinks}
          isLoading={isLoading}
          source={source}
          error={error}
        />

        <Skills
          capabilities={content.capabilities}
          skillMatrix={content.skillMatrix}
          workflow={content.workflow}
        />

        <Projects projects={content.projects} />

        <Contact contact={content.contact} faq={content.faq} />
      </main>

      <Footer site={content.site} socialLinks={content.socialLinks} />
    </div>
  );
}

export default App;
