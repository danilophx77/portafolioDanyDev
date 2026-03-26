import { useState } from "react";
import {
  FiClock,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiSend,
} from "react-icons/fi";

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
          payload.delivery === "smtp"
            ? contact.form.successMessage
            : payload.message || contact.form.queuedMessage,
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
    <section className="section-shell" id="contact">
      <div className="section-container contact-layout">
        <div className="contact-sidebar">
          <div className="contact-card">
            <p className="section-eyebrow">Contacto</p>
            <h2>{contact.headline}</h2>
            <p>{contact.description}</p>

            <div className="response-card">
              <FiClock />
              <span>{contact.form.responseTime}</span>
            </div>

            <div className="channel-list">
              {contact.channels.map((channel) => {
                const Icon = channelIcons[channel.type] || FiGithub;
                const isResume = channel.type === "resume";

                return (
                  <a
                    className="channel-card"
                    key={channel.label}
                    href={channel.href}
                    target={isResume ? "_self" : "_blank"}
                    rel="noreferrer"
                    download={isResume}
                  >
                    <span className="channel-icon">
                      <Icon />
                    </span>
                    <span className="channel-copy">
                      <strong>{channel.label}</strong>
                      <span>{channel.value}</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="faq-card">
            <p className="section-eyebrow">FAQ rapido</p>
            <div className="faq-list">
              {faq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <form className="contact-form-card" onSubmit={handleSubmit}>
          <div className="card-heading">
            <p className="section-eyebrow">Formulario conectado a API</p>
            <h3>Cuentame que quieres construir o mejorar</h3>
          </div>

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

          {status.message ? (
            <div className={status.type === "success" ? "form-status form-status-success" : "form-status form-status-error"}>
              {status.message}
            </div>
          ) : null}

          <button className="button-primary contact-submit" type="submit" disabled={isSubmitting}>
            <span>{isSubmitting ? "Enviando..." : "Enviar mensaje"}</span>
            <FiSend />
          </button>
        </form>
      </div>
    </section>
  );
};
