import { FiDownload, FiGithub, FiLinkedin } from "react-icons/fi";

const iconMap = {
  download: FiDownload,
  github: FiGithub,
  linkedin: FiLinkedin,
};

export const Footer = ({ site, socialLinks }) => {
  return (
    <footer className="site-footer">
      <div className="section-container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark">DP</span>
          <div>
            <strong>{site.brand}</strong>
            <p>{site.role}</p>
          </div>
        </div>

        <p className="footer-copy">
          {site.name}. {site.tagline}
        </p>

        <div className="footer-links">
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
              >
                <Icon />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
