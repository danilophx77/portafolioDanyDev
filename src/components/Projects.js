import { AnimatePresence, motion } from "framer-motion";
import { useDeferredValue, useState } from "react";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import {
  compactStagger,
  fadeScale,
  fadeUp,
  hoverLift,
  sectionViewport,
  staggerContainer,
  tapShrink,
} from "../lib/motion";

export const Projects = ({ projects }) => {
  const categories = ["Todos", ...new Set(projects.map((project) => project.category))];
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const deferredCategory = useDeferredValue(selectedCategory);

  const visibleProjects =
    deferredCategory === "Todos"
      ? projects
      : projects.filter((project) => project.category === deferredCategory);

  return (
    <motion.section
      className="section-shell"
      id="projects"
      initial="hidden"
      whileInView="show"
      viewport={sectionViewport}
      variants={staggerContainer}
    >
      <div className="section-container">
        <motion.div className="section-header section-header-inline" variants={staggerContainer}>
          <motion.div variants={staggerContainer}>
            <motion.p className="section-eyebrow" variants={fadeUp}>
              Casos seleccionados
            </motion.p>
            <motion.h2 variants={fadeUp}>
              Trabajo con mejor foco visual y mejor fundamento tecnico.
            </motion.h2>
          </motion.div>

          <motion.p className="section-header-copy" variants={fadeUp}>
            Este redisenio ya no ensena solo tarjetas sueltas. Presenta mejor el
            valor del proyecto, el stack que usa y el impacto tecnico de cada
            bloque.
          </motion.p>
        </motion.div>

        <motion.div
          className="project-filter-bar"
          role="tablist"
          aria-label="Filtrar proyectos"
          variants={compactStagger}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              className={
                selectedCategory === category
                  ? "project-filter project-filter-active"
                  : "project-filter"
              }
              type="button"
              onClick={() => setSelectedCategory(category)}
              variants={fadeUp}
              whileHover={hoverLift}
              whileTap={tapShrink}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div className="project-grid" layout variants={compactStagger}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleProjects.map((project) => (
              <motion.article
                className="project-card"
                key={project.title}
                layout
                style={{ "--project-accent": project.accent }}
                variants={fadeScale}
                initial="hidden"
                animate="show"
                exit="exit"
                whileHover={hoverLift}
              >
                <div className="project-card-top">
                  <div>
                    <p className="project-category">{project.category}</p>
                    <h3>{project.title}</h3>
                  </div>
                  <span className="project-year">{project.year}</span>
                </div>

                {project.featured ? <span className="featured-pill">Featured</span> : null}

                <p className="project-summary">{project.summary}</p>
                <p className="project-impact">{project.impact}</p>

                <div className="chip-list">
                  {project.stack.map((item) => (
                    <span className="skill-chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>

                <div className="project-actions">
                  {project.links.github ? (
                    <a href={project.links.github} target="_blank" rel="noreferrer">
                      <FiGithub />
                      <span>Repositorio</span>
                    </a>
                  ) : null}

                  {project.links.live ? (
                    <a href={project.links.live} target="_blank" rel="noreferrer">
                      <FiArrowUpRight />
                      <span>Live</span>
                    </a>
                  ) : null}

                  {!project.links.github && !project.links.live ? (
                    <span className="project-preview-muted">Enlace pendiente de agregar</span>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
};

