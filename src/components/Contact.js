import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  FiClock,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiSend,
} from "react-icons/fi";
import {
  compactStagger,
  fadeScale,
  fadeUp,
  hoverLift,
  sectionViewport,
  staggerContainer,
  tapShrink,
} from "../lib/motion";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

const channelIcons = {
  github: FiGithub,
  linkedin: FiLinkedin,
  resume: FiDownload,
};

export const Contact = ({ contact, faq }) => {
  const [formValues, setFormValues] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.name.trim() || !formValues.email.trim() || !formValues.message.trim()) {
      setStatus({
        type: "error",
        message: "Completa nombre, email y mensaje antes de enviar.",
      });
      return;
    }

    if (formValues.message.trim().length < 20) {
      setStatus({
        type: "error",
        message: "El mensaje debe tener al menos 20 caracteres.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || "No se pudo enviar el mensaje.");
      }

      setStatus({
        type: "success",
        message:
          payload.delivery === "queued"
            ? payload.message || contact.form.queuedMessage
            : payload.message || contact.form.successMessage,
      });
      setFormValues(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : contact.form.fallbackMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      className="section-shell"
      id="contact"
      initial="hidden"
      whileInView="show"
      viewport={sectionViewport}
      variants={staggerContainer}
    >
      <div className="section-container contact-layout">
        <motion.div className="contact-sidebar" variants={staggerContainer}>
          <motion.div className="contact-card" variants={fadeScale} whileHover={hoverLift}>
            <motion.p className="section-eyebrow" variants={fadeUp}>
              Contacto
            </motion.p>
            <motion.h2 variants={fadeUp}>{contact.headline}</motion.h2>
            <motion.p variants={fadeUp}>{contact.description}</motion.p>

            <motion.div className="response-card" variants={fadeUp} whileHover={hoverLift}>
              <FiClock />
              <span>{contact.form.responseTime}</span>
            </motion.div>

            <motion.div className="channel-list" variants={compactStagger}>
              {contact.channels.map((channel) => {
                const Icon = channelIcons[channel.type] || FiGithub;
                const isResume = channel.type === "resume";

                return (
                  <motion.a
                    className="channel-card"
                    key={channel.label}
                    href={channel.href}
                    target={isResume ? "_self" : "_blank"}
                    rel="noreferrer"
                    download={isResume}
                    variants={fadeUp}
                    whileHover={hoverLift}
                    whileTap={tapShrink}
                  >
                    <span className="channel-icon">
                      <Icon />
                    </span>
                    <span className="channel-copy">
                      <strong>{channel.label}</strong>
                      <span>{channel.value}</span>
                    </span>
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div className="faq-card" variants={fadeScale} whileHover={hoverLift}>
            <motion.p className="section-eyebrow" variants={fadeUp}>
              FAQ rapido
            </motion.p>
            <motion.div className="faq-list" variants={compactStagger}>
              {faq.map((item) => (
                <motion.details key={item.question} variants={fadeUp}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </motion.details>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.form className="contact-form-card" onSubmit={handleSubmit} variants={fadeScale}>
          <motion.div className="card-heading" variants={staggerContainer}>
            <motion.p className="section-eyebrow" variants={fadeUp}>
              Formulario conectado a API
            </motion.p>
            <motion.h3 variants={fadeUp}>Cuentame que quieres construir o mejorar</motion.h3>
          </motion.div>

          <div className="form-grid">
            <label>
              <span>Nombre</span>
              <input
                name="name"
                type="text"
                placeholder="Tu nombre"
                value={formValues.name}
                onChange={onFieldChange}
              />
            </label>

            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formValues.email}
                onChange={onFieldChange}
              />
            </label>

            <label className="form-grid-full">
              <span>Asunto</span>
              <input
                name="subject"
                type="text"
                placeholder="Redisenio, landing, portfolio, API..."
                value={formValues.subject}
                onChange={onFieldChange}
              />
            </label>

            <label className="form-grid-full form-honeypot">
              <span>Empresa</span>
              <input
                name="company"
                type="text"
                tabIndex="-1"
                autoComplete="off"
                value={formValues.company}
                onChange={onFieldChange}
              />
            </label>

            <label className="form-grid-full">
              <span>Mensaje</span>
              <textarea
                name="message"
                rows="7"
                placeholder="Describe la idea, el objetivo del sitio o que parte quieres mejorar."
                value={formValues.message}
                onChange={onFieldChange}
              />
            </label>
          </div>

          <AnimatePresence initial={false} mode="wait">
            {status.message ? (
              <motion.div
                key={`${status.type}-${status.message}`}
                className={
                  status.type === "success"
                    ? "form-status form-status-success"
                    : "form-status form-status-error"
                }
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {status.message}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.button
            className="button-primary contact-submit"
            type="submit"
            disabled={isSubmitting}
            whileHover={hoverLift}
            whileTap={tapShrink}
          >
            <span>{isSubmitting ? "Enviando..." : "Enviar mensaje"}</span>
            <FiSend />
          </motion.button>
        </motion.form>
      </div>
    </motion.section>
  );
};

