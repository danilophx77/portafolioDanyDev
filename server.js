const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CONTENT_PATH = path.join(__dirname, "src", "content", "portfolio-content.json");
const BUILD_PATH = path.join(__dirname, "build");
const RATE_WINDOW_MINUTES = Number(process.env.CONTACT_RATE_WINDOW_MINUTES || 15);
const RATE_MAX_REQUESTS = Number(process.env.CONTACT_RATE_MAX_REQUESTS || 5);
const rateWindowMs = RATE_WINDOW_MINUTES * 60 * 1000;
const rateStore = new Map();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

const smtpEnabled = Boolean(
  process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.CONTACT_TO_EMAIL
);

const mailTransport = smtpEnabled
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

const readPortfolioContent = () => {
  const rawContent = fs.readFileSync(CONTENT_PATH, "utf8");
  return JSON.parse(rawContent);
};

const getClientIp = (request) => {
  const forwarded = request.headers["x-forwarded-for"];

  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  return request.socket.remoteAddress || "unknown";
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeField = (value) => String(value || "").trim();

const normalizeSubmission = (payload) => ({
  name: sanitizeField(payload.name),
  email: sanitizeField(payload.email).toLowerCase(),
  subject: sanitizeField(payload.subject),
  message: sanitizeField(payload.message),
  company: sanitizeField(payload.company),
});

const validateSubmission = (submission) => {
  const errors = [];

  if (!submission.name || submission.name.length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) {
    errors.push("Introduce un email valido.");
  }

  if (!submission.message || submission.message.length < 20) {
    errors.push("El mensaje debe tener al menos 20 caracteres.");
  }

  if (submission.subject.length > 120) {
    errors.push("El asunto no puede superar 120 caracteres.");
  }

  if (submission.message.length > 2000) {
    errors.push("El mensaje no puede superar 2000 caracteres.");
  }

  return errors;
};

const rateLimitContact = (request, response, next) => {
  if (request.path !== "/api/contact" || request.method !== "POST") {
    next();
    return;
  }

  const clientIp = getClientIp(request);
  const now = Date.now();
  const recentRequests = (rateStore.get(clientIp) || []).filter(
    (timestamp) => now - timestamp < rateWindowMs
  );

  if (recentRequests.length >= RATE_MAX_REQUESTS) {
    response.status(429).json({
      ok: false,
      message: `Has alcanzado el limite de ${RATE_MAX_REQUESTS} mensajes cada ${RATE_WINDOW_MINUTES} minutos.`,
    });
    return;
  }

  recentRequests.push(now);
  rateStore.set(clientIp, recentRequests);
  next();
};

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(rateLimitContact);
app.use((request, response, next) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});

app.get("/api/health", (request, response) => {
  response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    smtpEnabled,
  });
});

app.get("/api/content", (request, response) => {
  response.json(readPortfolioContent());
});

app.get("/api/projects", (request, response) => {
  const content = readPortfolioContent();
  response.json({ items: content.projects });
});

app.get("/api/skills", (request, response) => {
  const content = readPortfolioContent();
  response.json({
    capabilities: content.capabilities,
    skillMatrix: content.skillMatrix,
    workflow: content.workflow,
  });
});

app.post("/api/contact", async (request, response) => {
  const content = readPortfolioContent();
  const submission = normalizeSubmission(request.body || {});

  if (submission.company) {
    response.status(202).json({
      ok: true,
      delivery: "discarded",
      message: "Mensaje recibido.",
    });
    return;
  }

  const errors = validateSubmission(submission);

  if (errors.length > 0) {
    response.status(400).json({
      ok: false,
      message: errors[0],
      errors,
    });
    return;
  }

  if (!mailTransport) {
    console.log("[contact:queued]", submission);
    response.status(202).json({
      ok: true,
      delivery: "queued",
      message: content.contact.form.queuedMessage,
    });
    return;
  }

  try {
    await mailTransport.sendMail({
      from: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: submission.email,
      subject: `[Portfolio] ${submission.subject || "Nuevo mensaje desde el portfolio"}`,
      text: [
        `Nombre: ${submission.name}`,
        `Email: ${submission.email}`,
        `Asunto: ${submission.subject || "Sin asunto"}`,
        "",
        submission.message,
      ].join("\n"),
      html: `
        <h2>Nuevo mensaje desde el portfolio</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(submission.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
        <p><strong>Asunto:</strong> ${escapeHtml(submission.subject || "Sin asunto")}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(submission.message).replace(/\n/g, "<br />")}</p>
      `,
    });

    response.status(200).json({
      ok: true,
      delivery: "smtp",
      message: content.contact.form.successMessage,
    });
  } catch (error) {
    console.error("[contact:error]", error);
    response.status(500).json({
      ok: false,
      message: "No se pudo enviar el mensaje. Intentalo de nuevo mas tarde.",
    });
  }
});

if (fs.existsSync(BUILD_PATH)) {
  app.use(express.static(BUILD_PATH));

  app.get("*", (request, response, next) => {
    if (request.path.startsWith("/api/")) {
      next();
      return;
    }

    response.sendFile(path.join(BUILD_PATH, "index.html"));
  });
}

if (mailTransport) {
  mailTransport.verify().then(
    () => console.log("SMTP ready"),
    (error) => console.error("SMTP verification failed", error.message)
  );
}

app.listen(PORT, () => {
  console.log(`Portfolio API running on http://localhost:${PORT}`);
});
