import { MotionConfig, motion } from "framer-motion";
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
    <MotionConfig
      reducedMotion="never"
      transition={{ type: "spring", stiffness: 120, damping: 22 }}
    >
      <motion.div
        className="app-shell"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="app-glow app-glow-left"
          aria-hidden="true"
          animate={{ x: [0, 24, 0], y: [0, -18, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="app-glow app-glow-right"
          aria-hidden="true"
          animate={{ x: [0, -26, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

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
      </motion.div>
    </MotionConfig>
  );
}

export default App;
