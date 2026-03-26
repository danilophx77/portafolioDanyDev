import { useEffect, useState } from "react";
import {
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMenu,
  FiX,
} from "react-icons/fi";

const SECTION_LINKS = [
  { id: "home", label: "Inicio" },
  { id: "skills", label: "Stack" },
  { id: "projects", label: "Proyectos" },
  { id: "contact", label: "Contacto" },
];

const iconMap = {
  download: FiDownload,
  github: FiGithub,
  linkedin: FiLinkedin,
};

export const NavBar = ({ site, socialLinks }) => {
  const [activeLink, setActiveLink] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const sections = SECTION_LINKS.map(({ id }) => document.getElementById(id)).filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveLink(visibleEntry.target.id);
        }
      },
      {
        threshold: [0.2, 0.35, 0.6],
        rootMargin: "-45% 0px -40% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`site-nav ${isScrolled ? "site-nav-scrolled" : ""}`}>
      <div className="section-container nav-inner">
        <a className="brand-lockup" href="#home" onClick={closeMenu}>
          <span className="brand-mark">DP</span>
          <span className="brand-copy">
            <strong>{site.brand}</strong>
            <span>{site.role}</span>
          </span>
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-label="Abrir navegacion"
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`nav-panel ${isMenuOpen ? "nav-panel-open" : ""}`}>
          <nav className="nav-links" aria-label="Secciones principales">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.id}
                className={activeLink === link.id ? "nav-link nav-link-active" : "nav-link"}
                href={`#${link.id}`}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon] || FiGithub;
              const isResume = link.icon === "download";

              return (
                <a
                  key={link.label}
                  className="icon-button"
                  href={link.href}
                  target={isResume ? "_self" : "_blank"}
                  rel="noreferrer"
                  download={isResume}
                  aria-label={link.label}
                  onClick={closeMenu}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
