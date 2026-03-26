import { FiCode, FiLayout, FiServer } from "react-icons/fi";

const iconMap = {
  code: FiCode,
  layout: FiLayout,
  server: FiServer,
};

export const Skills = ({ capabilities, skillMatrix, workflow }) => {
  return (
    <section className="section-shell" id="skills">
      <div className="section-container">
        <div className="section-header">
          <p className="section-eyebrow">Arquitectura y stack</p>
          <h2>Una base mas fuerte para diseno, desarrollo y evolucion.</h2>
          <p>
            El portfolio ahora esta construido para comunicar mejor y para
            escalar cambios sin romper su estructura. La parte visual y la
            parte tecnica avanzan juntas.
          </p>
        </div>

        <div className="capability-grid">
          {capabilities.map((capability) => {
            const Icon = iconMap[capability.icon] || FiCode;

            return (
              <article className="capability-card" key={capability.title}>
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
              </article>
            );
          })}
        </div>

        <div className="skills-layout">
          <article className="matrix-card">
            <div className="card-heading">
              <p className="section-eyebrow">Skill matrix</p>
              <h3>Tecnologias y criterios que sostienen el sitio</h3>
            </div>

            <div className="matrix-groups">
              {skillMatrix.map((group) => (
                <section className="matrix-group" key={group.title}>
                  <h4>{group.title}</h4>
                  <div className="chip-list">
                    {group.items.map((item) => (
                      <span className="skill-chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>

          <article className="workflow-card">
            <div className="card-heading">
              <p className="section-eyebrow">Como trabajo</p>
              <h3>Proceso corto, claro y orientado a resultado</h3>
            </div>

            <div className="workflow-list">
              {workflow.map((item) => (
                <div className="workflow-item" key={item.step}>
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
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
