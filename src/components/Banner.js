import { AnimatePresence, motion } from "framer-motion";
import headerImg from "../assets/img/header-img.svg";
import {
  FiActivity,
  FiArrowRight,
  FiDownload,
  FiGithub,
  FiLinkedin,
} from "react-icons/fi";
import {
  compactStagger,
  fadeScale,
  fadeUp,
  hoverLift,
  staggerContainer,
  tapShrink,
} from "../lib/motion";

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
    <motion.section
      className="hero section-shell"
      id="home"
      initial="hidden"
      animate="show"
      variants={staggerContainer}
    >
      <div className="section-container hero-grid">
        <motion.div className="hero-copy" variants={staggerContainer}>
          <motion.p className="section-eyebrow" variants={fadeUp}>
            {hero.eyebrow}
          </motion.p>
          <motion.p className="hero-kicker" variants={fadeUp}>
            {site.tagline}
          </motion.p>

          <motion.h1 className="hero-title" variants={compactStagger}>
            <motion.span variants={fadeUp}>{hero.titlePrefix}</motion.span>
            <motion.span className="hero-title-accent" variants={fadeUp}>
              {hero.titleEmphasis}
            </motion.span>
            <motion.span variants={fadeUp}>{hero.titleSuffix}</motion.span>
          </motion.h1>

          <motion.p className="hero-description" variants={fadeUp}>
            {hero.description}
          </motion.p>
          <motion.p className="hero-summary" variants={fadeUp}>
            {site.summary}
          </motion.p>

          <motion.div
            className="hero-pill-row"
            aria-label="Puntos clave"
            variants={compactStagger}
          >
            {hero.pills.map((pill) => (
              <motion.span
                className="hero-pill"
                key={pill}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.06 }}
                whileTap={tapShrink}
              >
                {pill}
              </motion.span>
            ))}
          </motion.div>

          <motion.div className="hero-actions" variants={compactStagger}>
            <motion.a
              className="button-primary"
              href={hero.primaryCta.href}
              variants={fadeUp}
              whileHover={hoverLift}
              whileTap={tapShrink}
            >
              <span>{hero.primaryCta.label}</span>
              <FiArrowRight />
            </motion.a>

            <motion.a
              className="button-secondary"
              href={hero.secondaryCta.href}
              download
              variants={fadeUp}
              whileHover={hoverLift}
              whileTap={tapShrink}
            >
              <span>{hero.secondaryCta.label}</span>
              <FiDownload />
            </motion.a>
          </motion.div>

          <motion.div className="hero-social-row" variants={compactStagger}>
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon] || FiGithub;
              const isResume = link.icon === "download";

              return (
                <motion.a
                  key={link.label}
                  className="hero-social-link"
                  href={link.href}
                  target={isResume ? "_self" : "_blank"}
                  rel="noreferrer"
                  download={isResume}
                  variants={fadeUp}
                  whileHover={hoverLift}
                  whileTap={tapShrink}
                >
                  <Icon />
                  <span>{link.label}</span>
                </motion.a>
              );
            })}
          </motion.div>

          <motion.div
            className={`hero-status ${source === "api" ? "hero-status-live" : "hero-status-local"}`}
            variants={fadeUp}
          >
            <FiActivity />
            <span>{sourceMessage}</span>
          </motion.div>

          <AnimatePresence initial={false}>
            {error ? (
              <motion.p
                className="hero-error"
                key={error}
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                Detalle: {error}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <motion.div className="hero-visual" variants={staggerContainer}>
          <motion.div
            className="portrait-card"
            variants={fadeScale}
            whileHover={hoverLift}
          >
            <div className="portrait-orb portrait-orb-left" aria-hidden="true" />
            <div className="portrait-orb portrait-orb-right" aria-hidden="true" />
            <motion.img
              src={headerImg}
              alt="Ilustracion de desarrollo y diseno web"
              animate={{ y: [0, -16, 0], rotate: [0, 1.4, 0] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
            />

            {hero.floatingCards.map((card, index) => (
              <motion.div
                className="floating-badge"
                key={card.label}
                style={
                  index === 0
                    ? { top: "1.3rem", right: "1.4rem" }
                    : { bottom: "1.5rem", left: "1.3rem", right: "auto" }
                }
                initial={{ opacity: 0, y: 36, scale: 0.88 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.75,
                  delay: 0.4 + index * 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </motion.div>
            ))}
          </motion.div>

          <motion.aside className="spotlight-card" variants={fadeScale} whileHover={hoverLift}>
            <motion.p className="spotlight-label" variants={fadeUp}>
              {hero.spotlight.title}
            </motion.p>
            <motion.ul className="spotlight-list" variants={compactStagger}>
              {hero.spotlight.items.map((item) => (
                <motion.li key={item} variants={fadeUp}>
                  {item}
                </motion.li>
              ))}
            </motion.ul>
            <motion.div className="availability-chip" variants={fadeUp} whileHover={hoverLift}>
              <span className="availability-dot" aria-hidden="true" />
              <span>{site.availability}</span>
            </motion.div>
          </motion.aside>
        </motion.div>
      </div>

      <motion.div
        className="section-container stats-grid"
        aria-label="Metricas destacadas"
        variants={compactStagger}
      >
        {stats.map((item) => (
          <motion.article
            className="stat-card"
            key={item.label}
            variants={fadeUp}
            whileHover={hoverLift}
          >
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
};
