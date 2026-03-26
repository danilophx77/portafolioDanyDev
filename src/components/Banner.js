import headerImg from "../assets/img/header-img.svg";
import {
  FiActivity,
  FiArrowRight,
  FiDownload,
  FiGithub,
  FiLinkedin,
} from "react-icons/fi";

const iconMap = {
  download: FiDownload,
  github: FiGithub,
  linkedin: FiLinkedin,
};

export const Banner = ({
  hero,
  site,
  stats,
  socialLinks,
  isLoading,
  source,
  error,
}) => {
  const sourceMessage = isLoading
    ? "Sincronizando contenido..."
    : source === "api"
      ? "Contenido servido por la API local."
      : "Mostrando contenido local mientras la API no responde.";

  return (
    <section className="hero section-shell" id="home">
      <div className="section-container hero-grid">
        <div className="hero-copy">
          <p className="section-eyebrow">{hero.eyebrow}</p>
          <p className="hero-kicker">{site.tagline}</p>

          <h1 className="hero-title">
            <span>{hero.titlePrefix}</span>
            <span className="hero-title-accent">{hero.titleEmphasis}</span>
            <span>{hero.titleSuffix}</span>
          </h1>

          <p className="hero-description">{hero.description}</p>
          <p className="hero-summary">{site.summary}</p>

          <div className="hero-pill-row" aria-label="Puntos clave">
            {hero.pills.map((pill) => (
              <span className="hero-pill" key={pill}>
                {pill}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            <a className="button-primary" href={hero.primaryCta.href}>
              <span>{hero.primaryCta.label}</span>
              <FiArrowRight />
            </a>

            <a className="button-secondary" href={hero.secondaryCta.href} download>
              <span>{hero.secondaryCta.label}</span>
              <FiDownload />
            </a>
          </div>

          <div className="hero-social-row">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon] || FiGithub;
              const isResume = link.icon === "download";

              return (
                <a
                  key={link.label}
                  className="hero-social-link"
                  href={link.href}
                  target={isResume ? "_self" : "_blank"}
                  rel="noreferrer"
                  download={isResume}
                >
                  <Icon />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          <div className={`hero-status ${source === "api" ? "hero-status-live" : "hero-status-local"}`}>
            <FiActivity />
            <span>{sourceMessage}</span>
          </div>

          {error ? <p className="hero-error">Detalle: {error}</p> : null}
        </div>

        <div className="hero-visual">
          <div className="portrait-card">
            <div className="portrait-orb portrait-orb-left" aria-hidden="true" />
            <div className="portrait-orb portrait-orb-right" aria-hidden="true" />
            <img src={headerImg} alt="Ilustracion de desarrollo y diseno web" />

            {hero.floatingCards.map((card, index) => (
              <div
                className="floating-badge"
                key={card.label}
                style={
                  index === 0
                    ? { top: "1.3rem", right: "1.4rem" }
                    : { bottom: "1.5rem", left: "1.3rem", right: "auto" }
                }
              >
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>

          <aside className="spotlight-card">
            <p className="spotlight-label">{hero.spotlight.title}</p>
            <ul className="spotlight-list">
              {hero.spotlight.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="availability-chip">
              <span className="availability-dot" aria-hidden="true" />
              <span>{site.availability}</span>
            </div>
          </aside>
        </div>
      </div>

      <div className="section-container stats-grid" aria-label="Metricas destacadas">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
};
