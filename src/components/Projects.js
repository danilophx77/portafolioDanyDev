import { useDeferredValue, useState } from "react";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";

export const Projects = ({ projects }) => {
  const categories = ["Todos", ...new Set(projects.map((project) => project.category))];
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const deferredCategory = useDeferredValue(selectedCategory);

  const visibleProjects =
    deferredCategory === "Todos"
      ? projects
      : projects.filter((project) => project.category === deferredCategory);

  return (
    <section className="section-shell" id="projects">
      <div className="section-container">
        <div className="section-header section-header-inline">
          <div>
            <p className="section-eyebrow">Casos seleccionados</p>
            <h2>Trabajo con mejor foco visual y mejor fundamento tecnico.</h2>
          </div>

          <p className="section-header-copy">
            Este redisenio ya no ensena solo tarjetas sueltas. Presenta mejor el
            valor del proyecto, el stack que usa y el impacto tecnico de cada
            bloque.
          </p>
        </div>

        <div className="project-filter-bar" role="tablist" aria-label="Filtrar proyectos">
          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "project-filter project-filter-active"
                  : "project-filter"
              }
              type="button"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="project-grid">
          {visibleProjects.map((project) => (
            <article
              className="project-card"
              key={project.title}
              style={{ "--project-accent": project.accent }}
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
