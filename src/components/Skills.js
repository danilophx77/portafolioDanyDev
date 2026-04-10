import { motion } from "framer-motion";
import { FiCode, FiLayout, FiServer } from "react-icons/fi";
import {
  compactStagger,
  fadeScale,
  fadeUp,
  hoverLift,
  sectionViewport,
  staggerContainer,
} from "../lib/motion";

const iconMap = {
  code: FiCode,
  layout: FiLayout,
  server: FiServer,
};

export const Skills = ({ capabilities, skillMatrix, workflow }) => {
  return (
    <motion.section
      className="section-shell"
      id="skills"
      initial="hidden"
      whileInView="show"
      viewport={sectionViewport}
      variants={staggerContainer}
    >
      <div className="section-container">
        <motion.div className="section-header" variants={staggerContainer}>
          <motion.p className="section-eyebrow" variants={fadeUp}>
            Arquitectura y stack
          </motion.p>
          <motion.h2 variants={fadeUp}>
            Una base mas fuerte para diseno, desarrollo y evolucion.
          </motion.h2>
          <motion.p variants={fadeUp}>
            El portfolio ahora esta construido para comunicar mejor y para
            escalar cambios sin romper su estructura. La parte visual y la
            parte tecnica avanzan juntas.
          </motion.p>
        </motion.div>

        <motion.div className="capability-grid" variants={compactStagger}>
          {capabilities.map((capability) => {
            const Icon = iconMap[capability.icon] || FiCode;

            return (
              <motion.article
                className="capability-card"
                key={capability.title}
                variants={fadeScale}
                whileHover={hoverLift}
              >
                <div className="capability-icon">
                  <Icon />
                </div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <ul className="capability-points">
                  {capability.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div className="skills-layout" variants={compactStagger}>
          <motion.article
            className="matrix-card"
            variants={fadeScale}
            whileHover={hoverLift}
          >
            <motion.div className="card-heading" variants={staggerContainer}>
              <motion.p className="section-eyebrow" variants={fadeUp}>
                Skill matrix
              </motion.p>
              <motion.h3 variants={fadeUp}>
                Tecnologias y criterios que sostienen el sitio
              </motion.h3>
            </motion.div>

            <motion.div className="matrix-groups" variants={compactStagger}>
              {skillMatrix.map((group) => (
                <motion.section className="matrix-group" key={group.title} variants={fadeUp}>
                  <h4>{group.title}</h4>
                  <div className="chip-list">
                    {group.items.map((item) => (
                      <span className="skill-chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.section>
              ))}
            </motion.div>
          </motion.article>

          <motion.article
            className="workflow-card"
            variants={fadeScale}
            whileHover={hoverLift}
          >
            <motion.div className="card-heading" variants={staggerContainer}>
              <motion.p className="section-eyebrow" variants={fadeUp}>
                Como trabajo
              </motion.p>
              <motion.h3 variants={fadeUp}>
                Proceso corto, claro y orientado a resultado
              </motion.h3>
            </motion.div>

            <motion.div className="workflow-list" variants={compactStagger}>
              {workflow.map((item) => (
                <motion.div className="workflow-item" key={item.step} variants={fadeUp}>
                  <div className="workflow-step">{item.step}</div>
                  <div className="workflow-copy">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <div className="deliverable-list">
                      {item.deliverables.map((deliverable) => (
                        <span className="deliverable-pill" key={deliverable}>
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.article>
        </motion.div>
      </div>
    </motion.section>
  );
};

